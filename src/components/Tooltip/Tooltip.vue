<script setup lang="ts">
import { ref, useId } from 'vue';
import styles from './tooltip.module.less';

export interface TooltipProps {
    content: string;
}

defineOptions({
    name: 'Tooltip',
    inheritAttrs: false,
});

defineProps<TooltipProps>();

const visible = ref(false);
const popupId = useId();

const show = () => {
    visible.value = true;
};

const hide = () => {
    visible.value = false;
};
</script>

<template>
    <span
        :class="styles.tooltip"
        data-tooltip-trigger
        v-bind="$attrs"
        :aria-describedby="visible ? popupId : undefined"
        :data-state="visible ? 'open' : 'closed'"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
    >
        <slot />
        <span
            v-if="visible"
            :id="popupId"
            :class="styles.popup"
            role="tooltip"
            data-layer="floating"
            data-state="open"
        >
            {{ content }}
        </span>
    </span>
</template>
