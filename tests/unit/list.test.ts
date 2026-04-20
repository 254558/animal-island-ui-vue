import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('List', () => {
    it('exports component and renders list items', async () => {
        const library = await import('../../src');

        expect(library.List).toBeTruthy();

        const wrapper = mount(library.List as NonNullable<typeof library.List>, {
            props: {
                items: ['苹果', '梨子', '桃子'],
            },
        });

        expect(wrapper.text()).toContain('苹果');
        expect(wrapper.text()).toContain('梨子');
        expect(wrapper.text()).toContain('桃子');
        expect(wrapper.attributes('role')).toBe('list');
    });
});
