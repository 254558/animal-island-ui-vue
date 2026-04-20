<script setup lang="ts">
import styles from './form-item.module.less';

export interface FormItemProps {
    label?: string;
    extra?: string;
    status?: 'error' | 'warning';
}

defineOptions({
    name: 'FormItem',
    inheritAttrs: false,
});

defineProps<FormItemProps>();
</script>

<template>
    <label :class="styles.item" :data-status="status || 'default'" v-bind="$attrs">
        <span v-if="label" :class="styles.label" data-form-label>{{ label }}</span>
        <span :class="styles.control">
            <slot />
        </span>
        <span
            v-if="extra"
            :class="[styles.extra, status && styles[`extra-${status}`]]"
            data-form-extra
            :role="status === 'error' ? 'alert' : undefined"
        >
            {{ extra }}
        </span>
    </label>
</template>
