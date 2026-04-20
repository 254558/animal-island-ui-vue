<script setup lang="ts">
import { onBeforeUnmount, ref, useId, watch } from 'vue';
import styles from './popover.module.less';

export interface PopoverProps {
    content: string;
    defaultOpen?: boolean;
}

defineOptions({
    name: 'Popover',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<PopoverProps>(), {
    defaultOpen: false,
});

const visible = ref(props.defaultOpen);
const rootRef = ref<HTMLElement | null>(null);
const popupId = useId();

const toggle = () => {
    visible.value = !visible.value;
};

const close = () => {
    visible.value = false;
};

const handleDocumentMouseDown = (event: MouseEvent) => {
    if (!visible.value) return;
    if (rootRef.value?.contains(event.target as Node)) return;
    close();
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && visible.value) {
        event.preventDefault();
        close();
    }
};

watch(visible, (isVisible) => {
    if (isVisible) {
        document.addEventListener('mousedown', handleDocumentMouseDown);
        document.addEventListener('keydown', handleKeydown);
        return;
    }

    document.removeEventListener('mousedown', handleDocumentMouseDown);
    document.removeEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleDocumentMouseDown);
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <span ref="rootRef" :class="styles.popover" v-bind="$attrs">
        <span
            :class="styles.trigger"
            data-popover-trigger
            role="button"
            tabindex="0"
            aria-haspopup="dialog"
            :aria-expanded="visible"
            :aria-describedby="visible ? popupId : undefined"
            :aria-controls="visible ? popupId : undefined"
            :data-state="visible ? 'open' : 'closed'"
            @click="toggle"
            @keydown.enter.prevent="toggle"
            @keydown.space.prevent="toggle"
        >
            <slot />
        </span>
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
