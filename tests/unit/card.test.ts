import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Card } from '../../src/components/Card';

describe('Card', () => {
    it('renders slot content and color class', () => {
        const wrapper = mount(Card, {
            props: { color: 'app-blue', type: 'title' },
            slots: { default: 'hello' },
        });

        expect(wrapper.text()).toContain('hello');
        expect(
            wrapper.classes().some((name) => name.includes('card-title'))
        ).toBe(true);
        expect(wrapper.attributes('data-layer')).toBe('raised');
    });
});
