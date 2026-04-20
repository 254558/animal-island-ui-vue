import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CodeBlock from '../../demo/CodeBlock.vue';

describe('Demo CodeBlock', () => {
    it('highlights TypeScript and template tokens', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                code: `import { Button } from 'animal-island-ui-vue';
const open = true;
<Button type="primary">{open}</Button>`,
            },
        });

        expect(wrapper.findAll('.token-keyword').map((node) => node.text())).toContain('import');
        expect(
            wrapper.findAll('.token-string').some((node) =>
                node.text().includes("'animal-island-ui-vue'")
            )
        ).toBe(true);
        expect(wrapper.findAll('.token-tag').some((node) => node.text().includes('<Button'))).toBe(
            true
        );
        expect(wrapper.findAll('.token-attr').map((node) => node.text())).toContain('type');
    });

    it('highlights shell and theme token samples', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                code: `npm install animal-island-ui-vue
:root {
  --animal-primary-color: #19c8b9;
}`,
            },
        });

        expect(wrapper.findAll('.token-package').map((node) => node.text())).toContain('npm');
        expect(wrapper.findAll('.token-command').map((node) => node.text())).toContain('install');
        expect(wrapper.findAll('.token-selector').map((node) => node.text())).toContain(':root');
        expect(wrapper.findAll('.token-css-var').map((node) => node.text())).toContain(
            '--animal-primary-color'
        );
        expect(wrapper.findAll('.token-color').map((node) => node.text())).toContain('#19c8b9');
    });
});
