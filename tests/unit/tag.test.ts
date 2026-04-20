import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Tag', () => {
    it('exports component and renders slot content', async () => {
        const library = await import('../../src');

        expect(library.Tag).toBeTruthy();

        const wrapper = mount(library.Tag as NonNullable<typeof library.Tag>, {
            props: {
                color: 'mint',
            },
            slots: {
                default: '岛民活动',
            },
        });

        expect(wrapper.text()).toContain('岛民活动');
        expect(wrapper.attributes('data-color')).toBe('mint');
    });
});
