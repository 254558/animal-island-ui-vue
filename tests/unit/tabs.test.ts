import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Tabs', () => {
    it('exports component and emits active key changes', async () => {
        const library = await import('../../src');

        expect(library.Tabs).toBeTruthy();

        const wrapper = mount(library.Tabs as NonNullable<typeof library.Tabs>, {
            props: {
                items: [
                    { key: 'fish', label: '鱼类' },
                    { key: 'bug', label: '昆虫' },
                ],
                defaultActiveKey: 'fish',
            },
        });

        await wrapper.findAll('button[role="tab"]')[1].trigger('click');

        expect(wrapper.emitted('update:activeKey')?.[0]).toEqual(['bug']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['bug']);
    });

    it('supports arrow key navigation across enabled tabs', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Tabs as NonNullable<typeof library.Tabs>, {
            attachTo: document.body,
            props: {
                items: [
                    { key: 'fish', label: '鱼类' },
                    { key: 'bug', label: '昆虫' },
                    { key: 'fossil', label: '化石', disabled: true },
                ],
                defaultActiveKey: 'fish',
            },
        });

        expect(wrapper.get('[role="tablist"]').attributes('aria-orientation')).toBe(
            'horizontal'
        );

        const tabs = wrapper.findAll('button[role="tab"]');

        expect(tabs[0].attributes('tabindex')).toBe('0');
        expect(tabs[0].attributes('data-state')).toBe('active');
        expect(tabs[1].attributes('tabindex')).toBe('-1');
        expect(tabs[2].attributes('aria-disabled')).toBe('true');

        (tabs[0].element as HTMLButtonElement).focus();
        expect(document.activeElement).toBe(tabs[0].element);

        await tabs[0].trigger('keydown', { key: 'ArrowRight' });
        await wrapper.vm.$nextTick();

        const nextTabs = wrapper.findAll('button[role="tab"]');

        expect(wrapper.emitted('update:activeKey')?.[0]).toEqual(['bug']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['bug']);
        expect(nextTabs[1].attributes('data-state')).toBe('active');
        expect(document.activeElement).toBe(nextTabs[1].element);
    });
});
