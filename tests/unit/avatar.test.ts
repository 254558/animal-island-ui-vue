import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Avatar', () => {
    it('exports component and falls back to text when no image is provided', async () => {
        const library = await import('../../src');

        expect(library.Avatar).toBeTruthy();

        const wrapper = mount(library.Avatar as NonNullable<typeof library.Avatar>, {
            props: {
                alt: 'Nook',
            },
        });

        expect(wrapper.text()).toContain('N');
        expect(wrapper.attributes('data-state')).toBe('fallback');
        expect(wrapper.attributes('role')).toBe('img');
        expect(wrapper.attributes('aria-label')).toBe('Nook');
    });

    it('falls back to text when image loading fails', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Avatar as NonNullable<typeof library.Avatar>, {
            props: {
                src: '/broken-avatar.png',
                alt: 'Isabelle',
            },
        });

        expect(wrapper.attributes('data-state')).toBe('image');

        await wrapper.get('img').trigger('error');

        expect(wrapper.attributes('data-state')).toBe('fallback');
        expect(wrapper.text()).toContain('I');
    });
});
