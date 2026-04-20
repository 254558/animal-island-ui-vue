import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Input } from '../../src/components/Input';

describe('Input', () => {
    it('emits clear and model updates', async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: 'hello',
                allowClear: true,
            },
        });

        expect(wrapper.get('[data-input-clear]').element.tagName).toBe('BUTTON');

        await wrapper.find('[data-input-clear]').trigger('click');

        expect(wrapper.emitted('clear')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    });

    it('hides clear action when disabled', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: 'hello',
                allowClear: true,
                disabled: true,
            },
        });

        expect(wrapper.find('[data-input-clear]').exists()).toBe(false);
        expect(wrapper.classes().some((className) => className.includes('wrapper-disabled'))).toBe(true);
    });
});
