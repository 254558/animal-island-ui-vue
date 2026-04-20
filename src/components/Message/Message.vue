<script setup lang="ts">
import styles from './message.module.less';

export interface MessageProps {
    content: string;
    type?: 'default' | 'success' | 'warning';
}

defineOptions({
    name: 'Message',
    inheritAttrs: false,
});

withDefaults(defineProps<MessageProps>(), {
    type: 'default',
});
</script>

<template>
    <div
        :class="[styles.message, styles[`message-${type}`]]"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-layer="raised"
        :data-type="type"
        v-bind="$attrs"
    >
        <span :class="styles.dot" aria-hidden="true" />
        <span :class="styles.content">
            <slot>{{ content }}</slot>
        </span>
    </div>
</template>
