import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Notification', () => {
    it('exports component and renders title and description', async () => {
        const library = await import('../../src');

        expect(library.Notification).toBeTruthy();

        const wrapper = mount(
            library.Notification as NonNullable<typeof library.Notification>,
            {
                props: {
                    title: '岛屿广播',
                    description: '今天有流星雨，请抬头看看天空。',
                },
            }
        );

        expect(wrapper.text()).toContain('岛屿广播');
        expect(wrapper.text()).toContain('今天有流星雨');
        expect(wrapper.attributes('role')).toBe('status');
        expect(wrapper.attributes('data-layer')).toBe('raised');
        expect(wrapper.attributes('aria-atomic')).toBe('true');
        expect(wrapper.attributes('data-type')).toBe('default');
        expect(wrapper.attributes('aria-labelledby')).toBe(
            wrapper.get('[data-notification-title]').attributes('id')
        );
        expect(wrapper.attributes('aria-describedby')).toBe(
            wrapper.get('[data-notification-description]').attributes('id')
        );
    });
});
