import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Switch } from '../../src/components/Switch';

describe('Switch', () => {
    it('toggles from defaultChecked state', async () => {
        const wrapper = mount(Switch, {
            props: {
                defaultChecked: true,
            },
        });

        await wrapper.trigger('click');

        expect(wrapper.emitted('change')?.[0]).toEqual([false]);
    });
});
