import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Empty', () => {
    it('exports component and renders description', async () => {
        const library = await import('../../src');

        expect(library.Empty).toBeTruthy();

        const wrapper = mount(library.Empty as NonNullable<typeof library.Empty>, {
            props: {
                description: '今天没有新的岛民消息',
            },
        });

        expect(wrapper.text()).toContain('今天没有新的岛民消息');
        expect(wrapper.attributes('role')).toBe('status');
        expect(wrapper.attributes('data-state')).toBe('empty');
    });
});
