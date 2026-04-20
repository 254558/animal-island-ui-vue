import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DEFAULT_REPO_DETAILS = {
    description:
        '一套基于 Vue 3、TypeScript 与 Vite 的动森风格组件库，提供温暖圆润的界面体验与在线文档。',
    homepage: 'https://animal-island-ui-vue.netlify.app',
    hasIssues: true,
    topics: [
        'vue',
        'vue3',
        'typescript',
        'vite',
        'component-library',
        'ui-components',
        'animal-crossing',
        'less',
    ],
};

export function parseRepoSlug(remoteUrl) {
    const normalized = remoteUrl
        .trim()
        .replace(/^git\+/, '')
        .replace(/\.git$/, '');
    const match = normalized.match(
        /github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/]+)$/i
    );

    if (!match?.groups?.owner || !match.groups.repo) {
        throw new Error(`无法从远端地址解析 GitHub 仓库：${remoteUrl}`);
    }

    return `${match.groups.owner}/${match.groups.repo}`;
}

export function resolveNetlifySiteId({
    cwd,
    env = process.env,
    fsModule = { existsSync, readFileSync },
} = {}) {
    if (env.NETLIFY_SITE_ID) {
        return env.NETLIFY_SITE_ID;
    }

    const statePath = join(cwd, '.netlify', 'state.json');
    if (!fsModule.existsSync(statePath)) {
        throw new Error(
            '未找到 Netlify site id，请设置 NETLIFY_SITE_ID 或先执行 netlify link。'
        );
    }

    const state = JSON.parse(fsModule.readFileSync(statePath, 'utf8'));
    if (!state.siteId) {
        throw new Error(`Netlify 状态文件缺少 siteId：${statePath}`);
    }

    return state.siteId;
}

export function getReleaseLabel({ version, sha }) {
    return `animal-island-ui-vue@${version}-sha-${sha}`;
}

export function buildNetlifyDeployUrl({
    siteId,
    production = true,
    title,
}) {
    const url = new URL(
        `https://api.netlify.com/api/v1/sites/${siteId}/deploys`
    );
    url.searchParams.set('production', String(production));

    if (title) {
        url.searchParams.set('title', title);
    }

    return url.toString();
}

export function buildNetlifyDeployStatusUrl(deployId) {
    return `https://api.netlify.com/api/v1/deploys/${deployId}`;
}
