<script setup lang="ts">
import styles from './form.module.less';

export interface FormProps {
    layout?: 'vertical' | 'inline';
}

defineOptions({
    name: 'Form',
    inheritAttrs: false,
});

withDefaults(defineProps<FormProps>(), {
    layout: 'vertical',
});
</script>

<template>
    <form
        :class="[styles.form, styles[`form-${layout}`]]"
        :data-layout="layout"
        novalidate
        v-bind="$attrs"
    >
        <slot />
    </form>
</template>
