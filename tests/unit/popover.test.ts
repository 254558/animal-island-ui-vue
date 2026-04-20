import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Popover', () => {
    it('exports component and shows content after trigger click', async () => {
        const library = await import('../../src');

        expect(library.Popover).toBeTruthy();

        const wrapper = mount(library.Popover as NonNullable<typeof library.Popover>, {
            props: {
                content: '今天适合钓鱼',
            },
            slots: {
                default: '<button>查看内容</button>',
            },
        });

        expect(wrapper.text()).not.toContain('今天适合钓鱼');

        await wrapper.get('[data-popover-trigger]').trigger('click');

        expect(wrapper.text()).toContain('今天适合钓鱼');
    });

    it('exposes expanded state and closes on escape or outside click', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Popover as NonNullable<typeof library.Popover>, {
            attachTo: document.body,
            props: {
                content: '今天适合钓鱼',
            },
            slots: {
                default: '<button>查看内容</button>',
            },
        });

        const trigger = wrapper.get('[data-popover-trigger]');

        expect(trigger.attributes('data-state')).toBe('closed');

        await trigger.trigger('click');
        expect(trigger.attributes('aria-expanded')).toBe('true');
        expect(trigger.attributes('data-state')).toBe('open');

        const popup = wrapper.get('[role="tooltip"]');
        expect(popup.exists()).toBe(true);
        expect(trigger.attributes('aria-describedby')).toBe(popup.attributes('id'));

        await trigger.trigger('keydown', { key: 'Escape' });
        expect(trigger.attributes('aria-expanded')).toBe('false');
        expect(trigger.attributes('data-state')).toBe('closed');

        await trigger.trigger('click');
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await wrapper.vm.$nextTick();
        expect(trigger.attributes('aria-expanded')).toBe('false');
    });

    it('marks the popup as floating and exposes open state when visible', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Popover as NonNullable<typeof library.Popover>, {
            props: {
                content: '今天适合钓鱼',
            },
            slots: {
                default: '<button>查看内容</button>',
            },
        });

        await wrapper.get('[data-popover-trigger]').trigger('click');

        const popup = wrapper.get('[role="tooltip"]');
        expect(popup.attributes('data-layer')).toBe('floating');
        expect(popup.attributes('data-state')).toBe('open');
        expect(wrapper.get('[data-popover-trigger]').attributes('data-state')).toBe('open');
    });
});
