<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs } from 'vue';
import styles from './textarea.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export interface TextareaProps {
    /** 推荐使用的双向绑定值。 */
    modelValue?: string;
    /** 兼容受控写法的值。 */
    value?: string;
    /** 非受控模式下的默认内容。 */
    defaultValue?: string;
    /** 是否显示清空按钮。 */
    allowClear?: boolean;
    /** 是否禁用。 */
    disabled?: boolean;
    /** 初始显示行数。 */
    rows?: number;
    /** 状态样式。 */
    status?: 'error' | 'warning';
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void;
    (event: 'change', value: string): void;
    (event: 'clear'): void;
}>();

defineOptions({
    name: 'Textarea',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<TextareaProps>(), {
    allowClear: false,
    disabled: false,
    rows: 4,
});

const attrs = useAttrs();
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const customHeight = ref<string>();
let stopDragging: (() => void) | null = null;

const controlledValue = computed(() =>
    props.modelValue !== undefined ? props.modelValue : props.value
);

const { currentValue, setValue } = useControllable<string>({
    value: controlledValue,
    defaultValue: props.defaultValue ?? '',
    onChange: (nextValue) => {
        emit('update:modelValue', nextValue);
        emit('change', nextValue);
    },
});

const wrapperClassName = computed(() =>
    classNames(
        styles.wrapper,
        props.status && styles[`wrapper-${props.status}`],
        props.disabled && styles['wrapper-disabled']
    )
);

const showClear = computed(
    () => props.allowClear && Boolean(currentValue.value) && !props.disabled
);

const handleInput = (event: Event) => {
    const nextValue = (event.target as HTMLTextAreaElement).value;
    setValue(nextValue);
};

const handleClear = () => {
    setValue('');
    emit('clear');
};

const cleanupDrag = () => {
    stopDragging?.();
    stopDragging = null;
};

const handleResizeStart = (event: MouseEvent) => {
    if (props.disabled || !textareaRef.value) return;

    event.preventDefault();

    const startY = event.clientY;
    const startHeight = textareaRef.value.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const nextHeight = Math.max(112, startHeight + moveEvent.clientY - startY);
        customHeight.value = `${nextHeight}px`;
    };

    const handleMouseUp = () => {
        cleanupDrag();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    stopDragging = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
};

onBeforeUnmount(() => {
    cleanupDrag();
});
</script>

<template>
    <span :class="wrapperClassName">
        <textarea
            ref="textareaRef"
            v-bind="attrs"
            :class="styles.textarea"
            :disabled="disabled"
            :rows="rows"
            :style="{ height: customHeight }"
            :value="currentValue"
            @input="handleInput"
        />
        <span
            data-textarea-resize-handle
            :data-disabled="disabled || undefined"
            :class="styles.resizeHandle"
            @mousedown="handleResizeStart"
        >
            <span :class="styles.resizeLine" />
            <span :class="styles.resizeLine" />
            <span :class="styles.resizeLine" />
        </span>
        <button
            v-if="showClear"
            type="button"
            data-textarea-clear
            :class="styles.clear"
            aria-label="清空内容"
            @mousedown.prevent
            @click="handleClear"
        >
            ×
        </button>
    </span>
</template>
