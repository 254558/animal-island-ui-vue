import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('Progress', () => {
    it('exports component and renders percent label with visual fill width', async () => {
        const library = await import('../../src');

        expect(library.Progress).toBeTruthy();

        const wrapper = mount(library.Progress as NonNullable<typeof library.Progress>, {
            props: {
                percent: 68,
            },
        });

        expect(wrapper.text()).toContain('68%');
        expect(wrapper.get('[data-progress-fill]').attributes('style')).toContain('68%');
        expect(wrapper.attributes('role')).toBe('progressbar');
        expect(wrapper.attributes('aria-valuenow')).toBe('68');
        expect(wrapper.attributes('aria-valuetext')).toBe('68%');
    });

    it('animates from zero to the target percent when animated is enabled', async () => {
        vi.useFakeTimers();
        const library = await import('../../src');

        const wrapper = mount(library.Progress as NonNullable<typeof library.Progress>, {
            props: {
                percent: 68,
                animated: true,
            },
        });

        expect(wrapper.get('[data-progress-fill]').attributes('style')).toContain('0%');

        await vi.runAllTimersAsync();
        await wrapper.vm.$nextTick();

        expect(wrapper.get('[data-progress-fill]').attributes('style')).toContain('68%');
        expect(wrapper.get('[data-progress-thumb]').attributes('style')).toContain('68%');

        vi.useRealTimers();
    });
});
