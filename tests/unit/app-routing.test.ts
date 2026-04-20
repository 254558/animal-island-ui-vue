import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { resolve } from 'node:path';

describe('Demo App routing shell', () => {
    afterEach(() => {
        window.location.hash = '';
    });

    it('renders quick-start inside the documentation layout instead of the home page', async () => {
        window.location.hash = '#/quick-start';

        const { default: App } = await import('../../demo/App.vue');

        const wrapper = mount(App, {
            global: {
                stubs: {
                    Cursor: {
                        props: ['src', 'hotspotX', 'hotspotY'],
                        template:
                            '<div data-cursor :data-src="src" :data-hotspot-x="hotspotX" :data-hotspot-y="hotspotY"><slot /></div>',
                    },
                    HomePage: {
                        template: '<div data-home-page />',
                    },
                    ComponentPage: {
                        props: ['activeKey'],
                        template: '<div data-component-page>{{ activeKey }}</div>',
                    },
                },
            },
        });

        expect(wrapper.find('[data-home-page]').exists()).toBe(false);
        expect(wrapper.find('[data-cursor]').exists()).toBe(true);
        expect(wrapper.get('[data-component-page]').text()).toContain('quick-start');
        expect(wrapper.find('.sidebar').exists()).toBe(true);
    });

    it('keeps the root entry as the dedicated home page', async () => {
        window.location.hash = '';

        const { default: App } = await import('../../demo/App.vue');

        const wrapper = mount(App, {
            global: {
                stubs: {
                    Cursor: {
                        props: ['src', 'hotspotX', 'hotspotY'],
                        template:
                            '<div data-cursor :data-src="src" :data-hotspot-x="hotspotX" :data-hotspot-y="hotspotY"><slot /></div>',
                    },
                    HomePage: {
                        template: '<div data-home-page />',
                    },
                    ComponentPage: {
                        props: ['activeKey'],
                        template: '<div data-component-page>{{ activeKey }}</div>',
                    },
                },
            },
        });

        expect(wrapper.find('[data-home-page]').exists()).toBe(true);
        expect(wrapper.find('[data-cursor]').exists()).toBe(false);
        expect(wrapper.find('[data-component-page]').exists()).toBe(false);
        expect(wrapper.find('.sidebar').exists()).toBe(false);
        expect(wrapper.find('.layout-home').attributes('data-page')).toBe('home');
    });

    it('uses a non-cover home background declaration so the artwork keeps the original proportions', async () => {
        const { readFileSync } = await import('node:fs');
        const source = readFileSync(resolve(process.cwd(), 'demo/App.vue'), 'utf8');

        expect(source).toContain('center top / auto 100% repeat-y');
    });

    it('keeps the documentation shell inside a cursor wrapper with demo cursor settings', async () => {
        window.location.hash = '#/button';

        const { default: App } = await import('../../demo/App.vue');

        const wrapper = mount(App, {
            global: {
                stubs: {
                    Cursor: {
                        props: ['src', 'hotspotX', 'hotspotY'],
                        template:
                            '<div data-cursor :data-src="src" :data-hotspot-x="hotspotX" :data-hotspot-y="hotspotY"><slot /></div>',
                    },
                    HomePage: {
                        template: '<div data-home-page />',
                    },
                    ComponentPage: {
                        props: ['activeKey'],
                        template: '<div data-component-page>{{ activeKey }}</div>',
                    },
                },
            },
        });

        const cursor = wrapper.get('[data-cursor]');

        expect(cursor.attributes('data-src')).toBeTruthy();
        expect(cursor.attributes('data-hotspot-x')).toBe('4');
        expect(cursor.attributes('data-hotspot-y')).toBe('0');
        expect(cursor.find('.sidebar').exists()).toBe(true);
        expect(cursor.find('.main').exists()).toBe(true);
    });
});
