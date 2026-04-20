<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import styles from './checkbox.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export interface CheckboxProps {
    modelValue?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'update:checked', value: boolean): void;
    (event: 'change', value: boolean): void;
}>();

defineOptions({
    name: 'Checkbox',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<CheckboxProps>(), {
    defaultChecked: false,
    disabled: false,
});

const instance = getCurrentInstance();

const rawProps = computed(() => instance?.vnode.props ?? {});

const controlledValue = computed(() =>
    'checked' in rawProps.value
        ? props.checked
        : 'modelValue' in rawProps.value
          ? props.modelValue
          : undefined
);

const { currentValue, setValue } = useControllable<boolean>({
    value: controlledValue,
    defaultValue: props.defaultChecked,
    onChange: (nextValue) => {
        emit('update:modelValue', nextValue);
        emit('update:checked', nextValue);
        emit('change', nextValue);
    },
});

const checkboxClassName = computed(() =>
    classNames(
        styles.checkbox,
        currentValue.value && styles['checkbox-checked'],
        props.disabled && styles['checkbox-disabled']
    )
);

const handleClick = () => {
    if (props.disabled) return;
    setValue(!currentValue.value);
};
</script>

<template>
    <button
        type="button"
        role="checkbox"
        :aria-checked="currentValue"
        :aria-disabled="disabled || undefined"
        :data-state="currentValue ? 'checked' : 'unchecked'"
        :class="checkboxClassName"
        :disabled="disabled"
        v-bind="$attrs"
        @click="handleClick"
    >
        <span :class="styles.box">
            <span v-if="currentValue" :class="styles.mark">✓</span>
        </span>
        <span v-if="$slots.default" :class="styles.label">
            <slot />
        </span>
    </button>
</template>
