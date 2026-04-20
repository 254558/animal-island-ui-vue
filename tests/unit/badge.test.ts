import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Badge', () => {
    it('exports component and renders count content', async () => {
        const library = await import('../../src');

        expect(library.Badge).toBeTruthy();

        const wrapper = mount(library.Badge as NonNullable<typeof library.Badge>, {
            props: {
                count: 3,
            },
            slots: {
                default: '<button>邮箱</button>',
            },
        });

        expect(wrapper.text()).toContain('3');
        expect(wrapper.text()).toContain('邮箱');
        expect(wrapper.get('[data-badge-count]').attributes('role')).toBe('status');
        expect(wrapper.get('[data-badge-count]').attributes('aria-live')).toBe(
            'polite'
        );
    });
});
