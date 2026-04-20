import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Rate', () => {
    it('exports component, renders custom items and emits selected value on click', async () => {
        const library = await import('../../src');

        expect(library.Rate).toBeTruthy();

        const wrapper = mount(library.Rate as NonNullable<typeof library.Rate>, {
            props: {
                defaultValue: 2,
            },
        });

        expect(wrapper.findAll('[data-rate-item]')).toHaveLength(5);

        await wrapper.findAll('button[role="radio"]')[3].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4]);
        expect(wrapper.emitted('change')?.[0]).toEqual([4]);
    });

    it('supports hover preview and keyboard selection', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Rate as NonNullable<typeof library.Rate>, {
            props: {
                defaultValue: 2,
            },
        });

        const items = wrapper.findAll('[data-rate-item]');

        expect(wrapper.attributes('role')).toBe('radiogroup');
        expect(items[1].attributes('data-active')).toBe('true');
        expect(items[2].attributes('data-active')).toBe('false');

        await items[3].trigger('mouseenter');

        expect(items[3].attributes('data-active')).toBe('true');
        expect(items[4].attributes('data-active')).toBe('false');

        await wrapper.trigger('mouseleave');

        expect(items[2].attributes('data-active')).toBe('false');

        await items[1].trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
        expect(wrapper.emitted('change')?.[0]).toEqual([3]);
    });

    it('supports half score preview and selection when allowHalf is enabled', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Rate as NonNullable<typeof library.Rate>, {
            props: {
                defaultValue: 2.5,
                allowHalf: true,
            },
        });

        const items = wrapper.findAll('[data-rate-item]');

        expect(items[2].attributes('data-active')).toBe('true');
        expect(items[2].attributes('data-half')).toBe('true');

        Object.defineProperty(items[3].element, 'getBoundingClientRect', {
            value: () => ({
                width: 40,
                left: 0,
                top: 0,
                right: 40,
                bottom: 40,
                height: 40,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }),
        });

        await items[3].trigger('mousemove', {
            clientX: 4,
        });

        expect(items[3].attributes('data-half')).toBe('true');

        await items[3].trigger('click', {
            clientX: 4,
        });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3.5]);
        expect(wrapper.emitted('change')?.[0]).toEqual([3.5]);
    });
});
