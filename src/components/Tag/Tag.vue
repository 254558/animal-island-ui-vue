<script setup lang="ts">
import { computed } from 'vue';
import styles from './tag.module.less';
import { classNames } from '@/internal/classNames';

export type TagColor = 'default' | 'mint' | 'yellow' | 'pink' | 'blue';

export interface TagProps {
    color?: TagColor;
}

defineOptions({
    name: 'Tag',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<TagProps>(), {
    color: 'default',
});

const tagClassName = computed(() =>
    classNames(styles.tag, props.color !== 'default' && styles[`tag-${props.color}`])
);
</script>

<template>
    <span :class="tagClassName" :data-color="color" v-bind="$attrs">
        <slot />
    </span>
</template>
