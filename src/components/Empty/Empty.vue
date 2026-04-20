<script setup lang="ts">
import styles from './empty.module.less';

export interface EmptyProps {
    title?: string;
    description?: string;
}

defineOptions({
    name: 'Empty',
    inheritAttrs: false,
});

withDefaults(defineProps<EmptyProps>(), {
    title: '空空如也',
    description: '这里暂时还没有内容',
});
</script>

<template>
    <div
        :class="styles.empty"
        role="status"
        aria-live="polite"
        data-state="empty"
        v-bind="$attrs"
    >
        <div :class="styles.icon">🍃</div>
        <div :class="styles.title">{{ title }}</div>
        <div :class="styles.description">{{ description }}</div>
        <div v-if="$slots.default" :class="styles.extra">
            <slot />
        </div>
    </div>
</template>
