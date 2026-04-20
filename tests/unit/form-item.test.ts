import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('FormItem', () => {
    it('exports component and renders label plus help text', async () => {
        const library = await import('../../src');

        expect(library.FormItem).toBeTruthy();

        const wrapper = mount(library.FormItem as NonNullable<typeof library.FormItem>, {
            props: {
                label: '岛民昵称',
                extra: '最多 12 个字符',
                status: 'error',
            },
            slots: {
                default: '<input value="Nook" />',
            },
        });

        expect(wrapper.text()).toContain('岛民昵称');
        expect(wrapper.text()).toContain('最多 12 个字符');
        expect(wrapper.attributes('data-status')).toBe('error');
        expect(wrapper.get('[data-form-label]').text()).toBe('岛民昵称');
        expect(wrapper.get('[data-form-extra]').attributes('role')).toBe('alert');
    });
});
