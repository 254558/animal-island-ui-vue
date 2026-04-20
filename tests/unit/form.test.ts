import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Form', () => {
    it('exports component and renders slot content', async () => {
        const library = await import('../../src');

        expect(library.Form).toBeTruthy();

        const wrapper = mount(library.Form as NonNullable<typeof library.Form>, {
            slots: {
                default: '<div>form body</div>',
            },
        });

        expect(wrapper.text()).toContain('form body');
        expect(wrapper.attributes('data-layout')).toBe('vertical');
        expect(wrapper.attributes('novalidate')).toBe('');
    });
});
