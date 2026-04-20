import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Message', () => {
    it('exports component and renders content text', async () => {
        const library = await import('../../src');

        expect(library.Message).toBeTruthy();

        const wrapper = mount(library.Message as NonNullable<typeof library.Message>, {
            props: {
                content: '今天的岛屿任务已完成',
            },
        });

        expect(wrapper.text()).toContain('今天的岛屿任务已完成');
        expect(wrapper.attributes('role')).toBe('status');
        expect(wrapper.attributes('aria-live')).toBe('polite');
        expect(wrapper.attributes('aria-atomic')).toBe('true');
        expect(wrapper.attributes('data-type')).toBe('default');
        expect(wrapper.attributes('data-layer')).toBe('raised');
    });
});
