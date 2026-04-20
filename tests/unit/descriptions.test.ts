import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Descriptions', () => {
    it('exports component and renders label-value pairs', async () => {
        const library = await import('../../src');

        expect(library.Descriptions).toBeTruthy();

        const wrapper = mount(
            library.Descriptions as NonNullable<typeof library.Descriptions>,
            {
                props: {
                    items: [
                        { label: '岛民名称', value: 'Nook' },
                        { label: '岛屿天气', value: '晴天' },
                    ],
                },
            }
        );

        expect(wrapper.text()).toContain('岛民名称');
        expect(wrapper.text()).toContain('Nook');
        expect(wrapper.text()).toContain('岛屿天气');
        expect(wrapper.attributes('role')).toBe('list');
        expect(wrapper.findAll('[data-descriptions-item]')).toHaveLength(2);
    });
});
