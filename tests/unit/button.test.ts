import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/Button';

describe('Button', () => {
    it('renders loading and slot content', () => {
        const wrapper = mount(Button, {
            props: { loading: true },
            slots: { default: '提交', icon: '☆' },
        });

        expect(wrapper.text()).toContain('提交');
        expect(wrapper.attributes('disabled')).toBeDefined();
        expect(wrapper.get('[data-button-loading]').attributes('aria-hidden')).toBe('true');
        expect(wrapper.attributes('data-loading')).toBe('true');
    });
});
