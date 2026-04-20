#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import {
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import {
    buildNetlifyDeployStatusUrl,
    buildNetlifyDeployUrl,
    DEFAULT_REPO_DETAILS,
    getReleaseLabel,
    parseRepoSlug,
    resolveNetlifySiteId,
} from './release-lib.mjs';

const cwd = process.cwd();
const curlCommand = process.platform === 'win32' ? 'curl.exe' : 'curl';
const npmCommand = 'npm';
const useWindowsShell = process.platform === 'win32';
const packageJson = JSON.parse(
    readFileSync(resolve(cwd, 'package.json'), 'utf8')
);
const mode = process.argv[2] ?? 'verify';
const args = process.argv.slice(3);

function redactArg(arg) {
    if (!arg) return arg;
    if (arg.startsWith('Authorization: Bearer ')) {
        return 'Authorization: Bearer ***';
    }
    if (
        arg.includes('github_pat_') ||
        arg.includes('npm_') ||
        arg.includes('nfp_')
    ) {
        return '***';
    }
    return arg;
}

function run(command, commandArgs, options = {}) {
    const displayArgs = (options.displayArgs ?? commandArgs).map(redactArg);
    console.log(`\n> ${command} ${displayArgs.join(' ')}`.trim());
    execFileSync(command, commandArgs, {
        cwd,
        stdio: 'inherit',
        shell:
            options.shell ?? (useWindowsShell && /^(npm|npx)$/i.test(command)),
        ...options,
    });
}

function getStdout(command, commandArgs) {
    return execFileSync(command, commandArgs, {
        cwd,
        encoding: 'utf8',
        shell: useWindowsShell && /^(npm|npx)$/i.test(command),
    }).trim();
}

function getStdoutInheritEnv(command, commandArgs) {
    return execFileSync(command, commandArgs, {
        cwd,
        encoding: 'utf8',
        shell: useWindowsShell && /^(npm|npx)$/i.test(command),
        env: {
            ...process.env,
            CURL_CA_BUNDLE: process.env.CURL_CA_BUNDLE ?? '',
        },
    }).trim();
}

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`缺少环境变量 ${name}`);
    }
    return value;
}

function ensureDir(dirPath) {
    mkdirSync(dirPath, { recursive: true });
}

function removeIfExists(targetPath) {
    if (existsSync(targetPath)) {
        rmSync(targetPath, { force: true, recursive: true });
    }
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        const body = await response.text();
        throw new Error(
            `请求失败 ${response.status} ${response.statusText}: ${body}`
        );
    }

    return response.json();
}

function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function verify() {
    run(npmCommand, ['test']);
    run(npmCommand, ['run', 'build']);
    run(npmCommand, ['run', 'build:demo']);
}

async function deployNetlify() {
    const authToken = requireEnv('NETLIFY_AUTH_TOKEN');
    const siteId = resolveNetlifySiteId({ cwd });
    const sha = getStdout('git', ['rev-parse', '--short', 'HEAD']);
    const releaseLabel = getReleaseLabel({ version: packageJson.version, sha });
    const releaseDir = resolve(cwd, '.release');
    const zipPath = resolve(releaseDir, `${releaseLabel}.zip`);

    verify();

    ensureDir(releaseDir);
    removeIfExists(zipPath);

    run('powershell', [
        '-NoProfile',
        '-Command',
        `Compress-Archive -Path 'demo-dist\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
    ]);

    const deploy = JSON.parse(
        getStdoutInheritEnv(curlCommand, [
            '-sS',
            '--fail-with-body',
            '-X',
            'POST',
            '-H',
            `Authorization: Bearer ${authToken}`,
            '-H',
            'Content-Type: application/zip',
            '--data-binary',
            `@${zipPath}`,
            buildNetlifyDeployUrl({
                siteId,
                production: true,
                title: releaseLabel,
            }),
        ])
    );
    const pendingDeployId = deploy.id ?? deploy.deploy_id;
    if (!pendingDeployId) {
        throw new Error(`Netlify 返回缺少 deploy id: ${JSON.stringify(deploy)}`);
    }

    const maxAttempts = 40;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const current = await requestJson(
            buildNetlifyDeployStatusUrl(pendingDeployId),
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    Accept: 'application/json',
                },
            }
        );
        const state = current.state ?? current.deploy_state ?? 'unknown';

        console.log(
            `Netlify deploy ${pendingDeployId} 状态：${state} (${attempt}/${maxAttempts})`
        );

        if (state === 'ready') {
            console.log(
                `Netlify 已发布：${current.ssl_url ?? current.url ?? DEFAULT_REPO_DETAILS.homepage}`
            );
            return;
        }

        if (state === 'error' || state === 'failed') {
            throw new Error(`Netlify 部署失败：${JSON.stringify(current)}`);
        }

        sleep(3000);
    }

    throw new Error('Netlify 部署等待超时，请到站点控制台查看最新构建。');
}

async function publishGithubPackage() {
    const githubToken = requireEnv('GITHUB_TOKEN');
    const repoSlug = parseRepoSlug(getStdout('git', ['remote', 'get-url', 'origin']));

    const body = JSON.stringify({ ref: 'main' });
    run(
        curlCommand,
        [
            '-sS',
            '--fail-with-body',
            '-X',
            'POST',
            '-H',
            `Authorization: Bearer ${githubToken}`,
            '-H',
            'Accept: application/vnd.github+json',
            '-H',
            'X-GitHub-Api-Version: 2022-11-28',
            `https://api.github.com/repos/${repoSlug}/actions/workflows/publish-github-package.yml/dispatches`,
            '-d',
            body,
        ],
        {
            env: {
                ...process.env,
                CURL_CA_BUNDLE: process.env.CURL_CA_BUNDLE ?? '',
            },
        }
    );
}

function publishNpm() {
    requireEnv('NPM_TOKEN');
    verify();
    run(npmCommand, ['publish']);
}

function updateRepoDetails() {
    const githubToken = requireEnv('GITHUB_TOKEN');
    const repoSlug = parseRepoSlug(getStdout('git', ['remote', 'get-url', 'origin']));
    const detailsBody = JSON.stringify({
        description: DEFAULT_REPO_DETAILS.description,
        homepage: DEFAULT_REPO_DETAILS.homepage,
        has_issues: DEFAULT_REPO_DETAILS.hasIssues,
    });
    const topicsBody = JSON.stringify({
        names: DEFAULT_REPO_DETAILS.topics,
    });

    run(curlCommand, [
        '-sS',
        '--fail-with-body',
        '-X',
        'PATCH',
        '-H',
        `Authorization: Bearer ${githubToken}`,
        '-H',
        'Accept: application/vnd.github+json',
        '-H',
        'X-GitHub-Api-Version: 2022-11-28',
        '-H',
        'Content-Type: application/json',
        `https://api.github.com/repos/${repoSlug}`,
        '-d',
        detailsBody,
    ]);

    run(curlCommand, [
        '-sS',
        '--fail-with-body',
        '-X',
        'PUT',
        '-H',
        `Authorization: Bearer ${githubToken}`,
        '-H',
        'Accept: application/vnd.github+json',
        '-H',
        'X-GitHub-Api-Version: 2022-11-28',
        '-H',
        'Content-Type: application/json',
        `https://api.github.com/repos/${repoSlug}/topics`,
        '-d',
        topicsBody,
    ]);
}

function usage() {
    console.log(`可用命令：
  node scripts/release.mjs verify
  node scripts/release.mjs repo-details
  node scripts/release.mjs netlify
  node scripts/release.mjs github-package
  node scripts/release.mjs npm
  node scripts/release.mjs full
`);
}

const runners = {
    verify,
    'repo-details': updateRepoDetails,
    netlify: deployNetlify,
    'github-package': publishGithubPackage,
    npm: publishNpm,
    full: async () => {
        updateRepoDetails();
        await deployNetlify();
        await publishGithubPackage();
    },
};

if (mode === 'help' || mode === '--help' || mode === '-h') {
    usage();
    process.exit(0);
}

if (!runners[mode]) {
    usage();
    throw new Error(`未知命令：${mode}${args.length ? ` ${args.join(' ')}` : ''}`);
}

await runners[mode]();
