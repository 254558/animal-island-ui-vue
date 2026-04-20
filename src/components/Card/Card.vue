<script setup lang="ts">
import { computed } from 'vue';
import styles from './card.module.less';
import { classNames } from '@/internal/classNames';

export type CardType = 'default' | 'title';

export type CardColor =
    | 'default'
    | 'app-pink'
    | 'purple'
    | 'app-blue'
    | 'app-yellow'
    | 'app-orange'
    | 'app-teal'
    | 'app-green'
    | 'app-red'
    | 'lime-green'
    | 'yellow-green'
    | 'brown'
    | 'warm-peach-pink';

/**
 * 内容卡片组件。
 * 适合承载入口信息、摘要内容和标题装饰块。
 */
export interface CardProps {
    /** 卡片形态。 */
    type?: CardType;
    /** 色板类型。 */
    color?: CardColor;
}

defineOptions({
    name: 'Card',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<CardProps>(), {
    type: 'default',
    color: 'default',
});

const cardClassName = computed(() =>
    classNames(
        styles.card,
        props.type === 'title' && styles['card-title'],
        props.color !== 'default' && styles[`card-${props.color}`]
    )
);
</script>

<template>
    <div :class="cardClassName" data-layer="raised" v-bind="$attrs">
        <slot />
    </div>
</template>
