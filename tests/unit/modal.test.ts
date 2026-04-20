import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Modal } from '../../src/components/Modal';
import { resolve } from 'node:path';

describe('Modal', () => {
    it('wraps teleported content in Cursor so overlay actions keep the custom pointer', () => {
        mount(Modal, {
            attachTo: document.body,
            props: {
                open: true,
            },
            slots: {
                default: '<p>modal body</p>',
            },
        });

        const source = document.body.innerHTML;

        expect(source).toContain('modal body');
        expect(source).toContain('data-cursor-scope');
    });

    it('renders content when open and hides footer when footer is null', () => {
        const wrapper = mount(Modal, {
            attachTo: document.body,
            props: {
                open: true,
                footer: null,
            },
            slots: {
                default: '<p>modal body</p>',
            },
        });

        expect(document.body.textContent).toContain('modal body');
        expect(document.body.textContent).not.toContain('取消');
    });

    it('moves focus into the dialog and restores it after close', async () => {
        const trigger = document.createElement('button');
        trigger.textContent = 'open';
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = mount(Modal, {
            attachTo: document.body,
            props: {
                open: true,
                title: '岛屿公告',
                closable: true,
            },
            slots: {
                default: '<p>modal body</p>',
            },
        });

        await wrapper.vm.$nextTick();

        const closeButton = document.body.querySelector('button[aria-label="Close"]') as HTMLButtonElement | null;
        expect(closeButton).not.toBeNull();
        expect(document.activeElement).toBe(closeButton);

        await wrapper.setProps({ open: false });
        await wrapper.vm.$nextTick();

        expect(document.activeElement).toBe(trigger);

        trigger.remove();
    });

    it('hides the close icon by default and still allows opt-in rendering', async () => {
        const wrapper = mount(Modal, {
            attachTo: document.body,
            props: {
                open: true,
                title: '岛屿公告',
            },
            slots: {
                default: '<p>modal body</p>',
            },
        });

        expect(wrapper.find('button[aria-label="Close"]').exists()).toBe(false);

        await wrapper.setProps({ closable: true });
        await wrapper.vm.$nextTick();

        expect(document.body.querySelector('button[aria-label="Close"]')).not.toBeNull();
    });

    it('keeps the original modal spacing and body typography rhythm', async () => {
        const { readFileSync } = await import('node:fs');
        const source = readFileSync(
            resolve(process.cwd(), 'src/components/Modal/modal.module.less'),
            'utf8'
        );

        expect(source).toContain('padding: 48px 48px 32px 48px');
        expect(source).toContain('padding-bottom: 15px');
        expect(source).toContain('padding-bottom: 20px');
        expect(source).toContain('font-size: 20px');
        expect(source).toContain('line-height: 1.6');
    });
});
