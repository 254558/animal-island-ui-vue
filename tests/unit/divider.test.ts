import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Divider } from '../../src/components/Divider';

describe('Divider', () => {
    it('renders divider root element', () => {
        const wrapper = mount(Divider);

        expect(wrapper.classes().some((name) => name.includes('divider'))).toBe(
            true
        );
    });
});
