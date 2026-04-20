import { describe, expect, it } from 'vitest';
import {
    buildNetlifyDeployStatusUrl,
    buildNetlifyDeployUrl,
    DEFAULT_REPO_DETAILS,
    getReleaseLabel,
    parseRepoSlug,
    resolveNetlifySiteId,
} from '../../scripts/release-lib.mjs';

describe('release lib', () => {
    it('parses https github remote urls', () => {
        expect(
            parseRepoSlug('https://github.com/yanstu/animal-island-ui-vue.git')
        ).toBe('yanstu/animal-island-ui-vue');
    });

    it('parses ssh github remote urls', () => {
        expect(
            parseRepoSlug('git@github.com:yanstu/animal-island-ui-vue.git')
        ).toBe('yanstu/animal-island-ui-vue');
    });

    it('prefers NETLIFY_SITE_ID from env', () => {
        expect(
            resolveNetlifySiteId({
                cwd: 'E:/demo',
                env: { NETLIFY_SITE_ID: 'site-from-env' },
            })
        ).toBe('site-from-env');
    });

    it('reads netlify site id from linked state file', () => {
        const fsModule = {
            existsSync: (path) =>
                typeof path === 'string' &&
                /E:[/\\]demo[/\\]\.netlify[/\\]state\.json$/.test(path),
            readFileSync: () => JSON.stringify({ siteId: 'site-from-file' }),
        };

        expect(
            resolveNetlifySiteId({
                cwd: 'E:/demo',
                env: {},
                fsModule,
            })
        ).toBe('site-from-file');
    });

    it('creates a readable release label', () => {
        expect(
            getReleaseLabel({ version: '0.1.0', sha: '6d95a6e' })
        ).toBe('animal-island-ui-vue@0.1.0-sha-6d95a6e');
    });

    it('builds a production netlify deploy url with title', () => {
        const url = new URL(
            buildNetlifyDeployUrl({
                siteId: 'site-123',
                production: true,
                title: 'animal-island-ui-vue@0.1.0',
            })
        );

        expect(url.origin).toBe('https://api.netlify.com');
        expect(url.pathname).toBe('/api/v1/sites/site-123/deploys');
        expect(url.searchParams.get('production')).toBe('true');
        expect(url.searchParams.get('title')).toBe(
            'animal-island-ui-vue@0.1.0'
        );
    });

    it('builds a netlify deploy status url', () => {
        expect(buildNetlifyDeployStatusUrl('deploy-123')).toBe(
            'https://api.netlify.com/api/v1/deploys/deploy-123'
        );
    });

    it('ships chinese animal-crossing flavored repo details defaults', () => {
        expect(DEFAULT_REPO_DETAILS.description).toContain('动森风格');
        expect(DEFAULT_REPO_DETAILS.homepage).toBe(
            'https://animal-island-ui-vue.netlify.app'
        );
        expect(DEFAULT_REPO_DETAILS.topics).toContain('animal-crossing');
    });
});
