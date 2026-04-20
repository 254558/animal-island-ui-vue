<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    code: string;
    label?: string;
}>();

interface HighlightToken {
    pattern: RegExp;
    className: string;
}

interface MatchSegment {
    start: number;
    end: number;
    className: string;
}

const TOKENS: HighlightToken[] = [
    {
        pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        className: 'token-comment',
    },
    {
        pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        className: 'token-string',
    },
    {
        pattern: /(<\/?[\w.]+|\/?>)/g,
        className: 'token-tag',
    },
    {
        pattern:
            /\b(import|from|const|let|var|function|return|export|default|useState|true|false|null|undefined)\b/g,
        className: 'token-keyword',
    },
    {
        pattern: /\b(npm|yarn|pnpm)\b/g,
        className: 'token-package',
    },
    {
        pattern: /(install|uninstall|run|add|remove)\b/g,
        className: 'token-command',
    },
    {
        pattern: /\s([a-zA-Z][\w-]*)(?==)/g,
        className: 'token-attr',
    },
    {
        pattern: /(\{|\})/g,
        className: 'token-brace',
    },
    {
        pattern: /(=>)/g,
        className: 'token-arrow',
    },
    {
        pattern: /(--[\w-]+)(?=\s*:)/g,
        className: 'token-css-var',
    },
    {
        pattern: /(:root)/g,
        className: 'token-selector',
    },
    {
        pattern: /(#[0-9a-fA-F]{3,8})\b/g,
        className: 'token-color',
    },
];

const highlightedHtml = computed(() => highlightCode(props.code));

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function collectMatches(line: string): MatchSegment[] {
    const matches: MatchSegment[] = [];

    TOKENS.forEach((token) => {
        const regex = new RegExp(token.pattern.source, token.pattern.flags);
        let match: RegExpExecArray | null = regex.exec(line);

        while (match) {
            const capturedText = match[1] ?? match[0];
            const offset =
                match[1] && match[0] !== match[1] ? match[0].indexOf(match[1]) : 0;
            const start = match.index + Math.max(offset, 0);

            matches.push({
                start,
                end: start + capturedText.length,
                className: token.className,
            });

            if (match[0].length === 0) {
                regex.lastIndex += 1;
            }

            match = regex.exec(line);
        }
    });

    return matches
        .sort((left, right) => {
            if (left.start !== right.start) {
                return left.start - right.start;
            }

            return right.end - left.end;
        })
        .reduce<MatchSegment[]>((segments, match) => {
            const previous = segments.at(-1);

            if (!previous || match.start >= previous.end) {
                segments.push(match);
            }

            return segments;
        }, []);
}

function highlightCode(code: string): string {
    return code
        .split('\n')
        .map((line) => {
            const matches = collectMatches(line);
            let cursor = 0;
            let html = '';

            matches.forEach((match) => {
                if (match.start > cursor) {
                    html += escapeHtml(line.slice(cursor, match.start));
                }

                html += `<span class="${match.className}">${escapeHtml(
                    line.slice(match.start, match.end)
                )}</span>`;
                cursor = match.end;
            });

            if (cursor < line.length) {
                html += escapeHtml(line.slice(cursor));
            }

            return html;
        })
        .join('\n');
}
</script>

<template>
    <div class="code-block">
        <div class="code-label">{{ label ?? '使用示例' }}</div>
        <pre class="code-content"><code class="code-inner" v-html="highlightedHtml" /></pre>
    </div>
</template>

<style scoped>
.code-block {
    margin-top: 28px;
}

.code-label {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 10px 10px 0 0;
    background: #3d3028;
    color: #e7e4e0;
    font-size: 14px;
    font-weight: 600;
}

.code-content {
    margin: 0;
    padding: 20px 24px;
    border: 1px solid #3d3028;
    border-radius: 0 10px 10px 10px;
    background: #2b2118;
    color: #e8d5bc;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow: auto;
    tab-size: 4;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace !important;
}

.code-inner {
    font: inherit;
}

:deep(.token-comment) {
    color: #6b5e50;
    font-style: italic;
    font-weight: 400;
}

:deep(.token-string) {
    color: #a8d4a0;
}

:deep(.token-tag),
:deep(.token-package),
:deep(.token-selector) {
    color: #f0a870;
}

:deep(.token-keyword),
:deep(.token-arrow) {
    color: #d4a0e0;
}

:deep(.token-attr),
:deep(.token-css-var) {
    color: #e8c87a;
}

:deep(.token-brace) {
    color: #d4b896;
}

:deep(.token-command) {
    color: #a8d4a0;
}

:deep(.token-color) {
    color: #8ab8e0;
}
</style>
