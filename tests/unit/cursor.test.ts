import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';

describe('Cursor', () => {
    it('accepts custom cursor source and hotspot coordinates', async () => {
        const library = await import('../../src');

        const wrapper = mount(library.Cursor as NonNullable<typeof library.Cursor>, {
            props: {
                src: '/cursor-test.png',
                hotspotX: 7,
                hotspotY: 3,
            },
            slots: {
                default: '<button>hover</button>',
            },
        });

        expect(wrapper.attributes('style')).toContain('--animal-cursor-url: url("/cursor-test.png")');
        expect(wrapper.attributes('style')).toContain('--animal-cursor-hotspot-x: 7');
        expect(wrapper.attributes('style')).toContain('--animal-cursor-hotspot-y: 3');
    });

    it('exposes a reusable cursor declaration so nested interactive elements do not fall back to the system cursor', async () => {
        const { readFileSync } = await import('node:fs');
        const source = readFileSync(
            resolve(process.cwd(), 'src/components/Cursor/cursor.module.less'),
            'utf8'
        );

        expect(source).toContain('--animal-cursor-value');
        expect(source).toContain('cursor: var(--animal-cursor-value) !important');
    });
});
