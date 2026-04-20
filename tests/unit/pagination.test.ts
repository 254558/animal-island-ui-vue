import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Pagination', () => {
    it('exports component and emits next page when clicking page item', async () => {
        const library = await import('../../src');

        expect(library.Pagination).toBeTruthy();

        const wrapper = mount(
            library.Pagination as NonNullable<typeof library.Pagination>,
            {
                props: {
                    current: 1,
                    total: 60,
                    pageSize: 10,
                },
            }
        );

        const firstPage = wrapper.get('button[aria-label="第 1 页"]');
        const secondPage = wrapper.get('button[aria-label="第 2 页"]');

        expect(firstPage.attributes('aria-current')).toBe('page');
        expect(firstPage.attributes('data-state')).toBe('active');
        expect(secondPage.attributes('aria-label')).toBe('第 2 页');

        await secondPage.trigger('click');

        expect(wrapper.emitted('update:current')?.[0]).toEqual([2]);
        expect(wrapper.emitted('change')?.[0]).toEqual([2]);
    });

    it('renders previous and next controls and disables them at the boundaries', async () => {
        const library = await import('../../src');

        const wrapper = mount(
            library.Pagination as NonNullable<typeof library.Pagination>,
            {
                props: {
                    current: 1,
                    total: 60,
                    pageSize: 10,
                },
            }
        );

        const prev = wrapper.get('button[aria-label="上一页"]');
        const next = wrapper.get('button[aria-label="下一页"]');

        expect(prev.attributes('disabled')).toBeDefined();
        expect(next.attributes('disabled')).toBeUndefined();

        await next.trigger('click');

        expect(wrapper.emitted('update:current')?.[0]).toEqual([2]);
    });
});
