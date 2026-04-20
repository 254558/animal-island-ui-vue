import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Slider', () => {
    it('exports component and renders custom thumb position while emitting updates', async () => {
        const library = await import('../../src');

        expect(library.Slider).toBeTruthy();

        const wrapper = mount(library.Slider as NonNullable<typeof library.Slider>, {
            props: {
                modelValue: 20,
                min: 0,
                max: 100,
            },
        });

        expect(wrapper.get('[data-slider-thumb]').attributes('style')).toContain('20%');

        await wrapper.get('input[type="range"]').setValue(60);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([60]);
        expect(wrapper.emitted('change')?.[0]).toEqual([60]);
    });
});
