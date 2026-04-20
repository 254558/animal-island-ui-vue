import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Drawer', () => {
    it('exports component and renders content when open', async () => {
        const library = await import('../../src');

        expect(library.Drawer).toBeTruthy();

        const wrapper = mount(library.Drawer as NonNullable<typeof library.Drawer>, {
            props: {
                open: true,
                title: '岛屿菜单',
            },
            slots: {
                default: '<p>drawer body</p>',
            },
        });

        expect(wrapper.text()).toContain('岛屿菜单');
        expect(wrapper.text()).toContain('drawer body');
    });

    it('focuses the close button, exposes motion state, and closes on escape', async () => {
        const library = await import('../../src');
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = mount(library.Drawer as NonNullable<typeof library.Drawer>, {
            attachTo: document.body,
            props: {
                open: true,
                title: '岛屿菜单',
            },
            slots: {
                default: '<p>drawer body</p>',
            },
        });

        await wrapper.vm.$nextTick();

        const panel = wrapper.get('[data-drawer-panel]');
        expect(panel.attributes('data-state')).toBe('open');
        expect(panel.attributes('role')).toBe('dialog');
        expect(panel.attributes('aria-modal')).toBe('true');
        expect(document.body.style.overflow).toBe('hidden');

        const title = wrapper.get('[data-drawer-title]');
        expect(panel.attributes('aria-labelledby')).toBe(title.attributes('id'));

        const closeButton = wrapper.get('button[aria-label="Close"]');
        expect(document.activeElement).toBe(closeButton.element);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await wrapper.vm.$nextTick();
        await wrapper.setProps({ open: false });
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
        expect(document.activeElement).toBe(trigger);
        expect(document.body.style.overflow).toBe('');

        trigger.remove();
    });

    it('supports custom width on the side placement and custom height on the bottom placement', async () => {
        const library = await import('../../src');

        const sideDrawer = mount(library.Drawer as NonNullable<typeof library.Drawer>, {
            props: {
                open: true,
                width: 520,
            },
            slots: {
                default: '<p>drawer body</p>',
            },
        });

        expect(sideDrawer.get('[data-drawer-panel]').attributes('style')).toContain('width: 520px');

        const bottomDrawer = mount(library.Drawer as NonNullable<typeof library.Drawer>, {
            props: {
                open: true,
                placement: 'bottom',
                height: 360,
            },
            slots: {
                default: '<p>drawer body</p>',
            },
        });

        expect(bottomDrawer.get('[data-drawer-panel]').attributes('style')).toContain('height: 360px');
    });
});
