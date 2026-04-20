<script setup lang="ts">
import styles from './badge.module.less';

export interface BadgeProps {
    count?: string | number;
}

defineOptions({
    name: 'Badge',
    inheritAttrs: false,
});

withDefaults(defineProps<BadgeProps>(), {
    count: '',
});
</script>

<template>
    <span :class="styles.badge" v-bind="$attrs">
        <slot />
        <span
            v-if="count !== ''"
            :class="styles.count"
            data-badge-count
            role="status"
            aria-live="polite"
        >
            {{ count }}
        </span>
    </span>
</template>
