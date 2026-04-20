<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import styles from './input.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export type InputSize = 'small' | 'middle' | 'large';

/**
 * 单行输入框。
 * 适合搜索、名称录入和短文本配置。
 */
export interface InputProps {
    /** 推荐使用的双向绑定值。 */
    modelValue?: string;
    /** 兼容受控写法的值。 */
    value?: string;
    /** 非受控模式下的默认值。 */
    defaultValue?: string;
    /** 输入框尺寸。 */
    size?: InputSize;
    /** 前缀文本。 */
    prefix?: string;
    /** 后缀文本。 */
    suffix?: string;
    /** 是否显示清空按钮。 */
    allowClear?: boolean;
    /** 状态样式。 */
    status?: 'error' | 'warning';
    /** 是否禁用。 */
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void;
    (event: 'change', value: string): void;
    (event: 'clear'): void;
}>();

defineOptions({
    name: 'Input',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<InputProps>(), {
    size: 'middle',
    allowClear: false,
    disabled: false,
});

const attrs = useAttrs();
const slots = useSlots();

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
        styles[`wrapper-${props.size}`],
        props.status && styles[`wrapper-${props.status}`],
        props.disabled && styles['wrapper-disabled']
    )
);

const hasPrefix = computed(() => Boolean(slots.prefix || props.prefix));
const hasSuffix = computed(() => Boolean(slots.suffix || props.suffix));
const showClear = computed(
    () => props.allowClear && Boolean(currentValue.value) && !props.disabled
);

const handleInput = (event: Event) => {
    const nextValue = (event.target as HTMLInputElement).value;
    setValue(nextValue);
};

const handleClear = () => {
    setValue('');
    emit('clear');
};
</script>

<template>
    <span :class="wrapperClassName">
        <span v-if="hasPrefix" :class="styles.prefix">
            <slot name="prefix">{{ prefix }}</slot>
        </span>
        <input
            v-bind="attrs"
            :class="styles.input"
            :disabled="disabled"
            :value="currentValue"
            @input="handleInput"
        />
        <button
            v-if="showClear"
            type="button"
            data-input-clear
            :class="styles.clear"
            aria-label="清空内容"
            @mousedown.prevent
            @click="handleClear"
        >
            ×
        </button>
        <span v-if="hasSuffix" :class="styles.suffix">
            <slot name="suffix">{{ suffix }}</slot>
        </span>
    </span>
</template>
