import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Radio', () => {
    it('exports component and emits selected value', async () => {
        const library = await import('../../src');

        expect(library.Radio).toBeTruthy();

        const wrapper = mount(library.Radio as NonNullable<typeof library.Radio>, {
            props: {
                modelValue: 'bug',
                value: 'fish',
            },
            slots: {
                default: '鱼类',
            },
        });

        expect(wrapper.text()).toContain('鱼类');

        await wrapper.get('[role="radio"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['fish']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['fish']);
    });

    it('exposes checked and disabled state semantics', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Radio as NonNullable<typeof library.Radio>, {
            props: {
                modelValue: 'fish',
                value: 'fish',
                disabled: true,
            },
        });

        expect(wrapper.attributes('data-state')).toBe('checked');
        expect(wrapper.attributes('aria-disabled')).toBe('true');

        await wrapper.get('[role="radio"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        expect(wrapper.emitted('change')).toBeFalsy();
    });
});
