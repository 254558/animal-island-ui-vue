import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it } from 'vitest';

describe('tooling bootstrap', () => {
  it('mounts a vue component in the test environment', () => {
    const DemoComponent = defineComponent({
      template: '<div>ready</div>',
    });

    const wrapper = mount(DemoComponent);

    expect(wrapper.text()).toBe('ready');
  });
});
