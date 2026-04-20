import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Select', () => {
    it('exports component and selects an option from the dropdown', async () => {
        const library = await import('../../src');

        expect(library.Select).toBeTruthy();

        const wrapper = mount(library.Select as NonNullable<typeof library.Select>, {
            props: {
                placeholder: '请选择岛屿活动',
                options: [
                    { label: '钓鱼大赛', value: 'fishing' },
                    { label: '捉虫大会', value: 'bug' },
                ],
            },
        });

        const trigger = wrapper.get('button[aria-haspopup="listbox"]');

        expect(trigger.text()).toContain('请选择岛屿活动');
        expect(trigger.attributes('role')).toBe('combobox');
        expect(trigger.attributes('data-state')).toBe('closed');

        await trigger.trigger('click');

        expect(trigger.attributes('data-state')).toBe('open');
        expect(wrapper.get('[role="listbox"]').attributes('data-state')).toBe('open');

        await wrapper.get('[role="option"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['fishing']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['fishing']);
        expect(trigger.attributes('data-state')).toBe('closed');
    });

    it('supports keyboard navigation and closes on escape or outside click', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Select as NonNullable<typeof library.Select>, {
            attachTo: document.body,
            props: {
                options: [
                    { label: '钓鱼大赛', value: 'fishing' },
                    { label: '捉虫大会', value: 'bug' },
                    { label: '流星观测', value: 'meteor', disabled: true },
                ],
            },
        });

        const trigger = wrapper.get('button[aria-haspopup="listbox"]');

        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(trigger.attributes('aria-expanded')).toBe('true');
        expect(wrapper.get('[role="option"][data-active="true"]').text()).toContain('钓鱼大赛');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.get('[role="option"][data-active="true"]').text()).toContain('捉虫大会');

        await trigger.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bug']);

        await trigger.trigger('click');
        expect(trigger.attributes('aria-expanded')).toBe('true');

        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await wrapper.vm.$nextTick();
        expect(trigger.attributes('aria-expanded')).toBe('false');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'Escape' });
        expect(trigger.attributes('aria-expanded')).toBe('false');
    });

    it('marks the dropdown as elevated and disables trigger affordance when disabled', async () => {
        const library = await import('../../src');

        const enabledWrapper = mount(library.Select as NonNullable<typeof library.Select>, {
            props: {
                options: [{ label: '钓鱼大赛', value: 'fishing' }],
            },
        });

        await enabledWrapper.get('button[aria-haspopup="listbox"]').trigger('click');
        expect(enabledWrapper.get('[role="listbox"]').attributes('data-layer')).toBe('floating');

        const disabledWrapper = mount(library.Select as NonNullable<typeof library.Select>, {
            props: {
                options: [{ label: '钓鱼大赛', value: 'fishing' }],
                disabled: true,
            },
        });

        expect(disabledWrapper.get('button[aria-haspopup="listbox"]').attributes('disabled')).toBeDefined();
        expect(
            disabledWrapper.get('button[aria-haspopup="listbox"]').attributes('aria-disabled')
        ).toBe('true');
        expect(
            disabledWrapper.classes().some((className) => className.includes('select'))
        ).toBe(true);
    });
});
