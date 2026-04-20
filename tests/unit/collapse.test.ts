import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Collapse } from '../../src/components/Collapse';
import { resolve } from 'node:path';

describe('Collapse', () => {
    it('opens when defaultExpanded is true', () => {
        const wrapper = mount(Collapse, {
            props: {
                question: 'q',
                answer: 'a',
                defaultExpanded: true,
            },
        });

        expect(wrapper.text()).toContain('a');
    });

    it('renders a dedicated glyph wrapper inside the toggle icon', () => {
        const wrapper = mount(Collapse, {
            props: {
                question: 'q',
                answer: 'a',
            },
        });

        const iconGlyph = wrapper.find('button > span:first-child span');

        expect(iconGlyph.exists()).toBe(true);
        expect(iconGlyph.text()).toBe('+');
    });

    it('keeps the question icon close to the original layered structure used by the demo styling', () => {
        const wrapper = mount(Collapse, {
            props: {
                question: 'q',
                answer: 'a',
            },
        });

        const icon = wrapper.get('button > span:first-child');

        expect(icon.text()).toBe('+');
        expect(icon.findAll('span')).toHaveLength(1);
        expect(icon.attributes('data-icon-shape')).toBe('round');
    });

    it('links the trigger and content region with aria attributes', async () => {
        const wrapper = mount(Collapse, {
            props: {
                question: 'q',
                answer: 'a',
            },
        });

        const trigger = wrapper.get('button');
        const content = wrapper.get('[data-collapse-content]');

        expect(trigger.attributes('aria-controls')).toBe(content.attributes('id'));
        expect(content.attributes('role')).toBe('region');
        expect(content.attributes('data-state')).toBe('closed');

        await trigger.trigger('click');

        expect(content.attributes('data-state')).toBe('open');
    });

    it('keeps a lighter icon rhythm closer to the original faq header proportions', async () => {
        const { readFileSync } = await import('node:fs');
        const source = readFileSync(
            resolve(process.cwd(), 'src/components/Collapse/collapse.module.less'),
            'utf8'
        );

        expect(source).toContain('gap: 12px');
        expect(source).toContain('padding: 18px 24px');
        expect(source).toContain('width: 24px');
        expect(source).toContain('height: 24px');
    });
});
