import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Checkbox', () => {
    it('exports component and toggles from defaultChecked', async () => {
        const library = await import('../../src');

        expect(library.Checkbox).toBeTruthy();

        const wrapper = mount(library.Checkbox as NonNullable<typeof library.Checkbox>, {
            props: {
                defaultChecked: false,
            },
            slots: {
                default: '允许钓鱼',
            },
        });

        expect(wrapper.text()).toContain('允许钓鱼');
        expect(wrapper.attributes('data-state')).toBe('unchecked');

        await wrapper.get('[role="checkbox"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.emitted('update:checked')?.[0]).toEqual([true]);
        expect(wrapper.emitted('change')?.[0]).toEqual([true]);
    });

    it('exposes disabled semantics and does not emit when disabled', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Checkbox as NonNullable<typeof library.Checkbox>, {
            props: {
                disabled: true,
                defaultChecked: true,
            },
        });

        expect(wrapper.attributes('aria-disabled')).toBe('true');
        expect(wrapper.attributes('data-state')).toBe('checked');

        await wrapper.get('[role="checkbox"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        expect(wrapper.emitted('update:checked')).toBeFalsy();
        expect(wrapper.emitted('change')).toBeFalsy();
    });
});
