#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
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

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`缺少环境变量 ${name}`);
    }
    return value;
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
    const branch = getStdout('git', ['branch', '--show-current']);

    verify();

    if (branch !== 'main') {
        throw new Error(`Netlify 发布仅允许在 main 执行，当前分支：${branch}`);
    }

    const siteBefore = await requestJson(
        `https://api.netlify.com/api/v1/sites/${siteId}`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json',
            },
        }
    );
    const previousDeployId = siteBefore.published_deploy?.id ?? null;

    console.log(`准备推送 main，发布标签：${releaseLabel}`);
    run('git', ['push', 'origin', 'main']);

    const maxAttempts = 40;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const current = await requestJson(
            `https://api.netlify.com/api/v1/sites/${siteId}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    Accept: 'application/json',
                },
            }
        );
        const publishedDeploy = current.published_deploy;
        const deployId = publishedDeploy?.id ?? current.deploy_id ?? 'unknown';
        const state = publishedDeploy?.state ?? current.state ?? 'unknown';
        const title = publishedDeploy?.title ?? '';

        console.log(
            `Netlify deploy ${deployId} 状态：${state} (${attempt}/${maxAttempts})${title ? ` / ${title}` : ''}`
        );

        if (deployId !== previousDeployId && state === 'ready') {
            console.log(
                `Netlify 已发布：${publishedDeploy?.ssl_url ?? current.ssl_url ?? current.url ?? DEFAULT_REPO_DETAILS.homepage}`
            );
            return;
        }

        if (state === 'error' || state === 'failed') {
            throw new Error(
                `Netlify 部署失败：${JSON.stringify(publishedDeploy ?? current)}`
            );
        }

        sleep(5000);
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
