import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Textarea', () => {
    it('exports component, clears current value and renders custom resize handle', async () => {
        const library = await import('../../src');

        expect(library.Textarea).toBeTruthy();

        const wrapper = mount(library.Textarea as NonNullable<typeof library.Textarea>, {
            props: {
                modelValue: '今天捡到了很多贝壳',
                allowClear: true,
            },
        });

        expect(wrapper.get('[data-textarea-resize-handle]')).toBeTruthy();
        expect(wrapper.get('[data-textarea-clear]').element.tagName).toBe('BUTTON');

        await wrapper.get('[data-textarea-clear]').trigger('click');

        expect(wrapper.emitted('clear')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['']);
    });

    it('hides resize handle and clear action when disabled', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Textarea as NonNullable<typeof library.Textarea>, {
            props: {
                modelValue: '今天捡到了很多贝壳',
                allowClear: true,
                disabled: true,
            },
        });

        expect(wrapper.find('[data-textarea-clear]').exists()).toBe(false);
        expect(wrapper.get('[data-textarea-resize-handle]').attributes('data-disabled')).toBe('true');
    });
});
