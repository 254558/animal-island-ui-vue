<script setup lang="ts">
import { computed } from 'vue';
import styles from './radio.module.less';
import { classNames } from '@/internal/classNames';

export interface RadioProps {
    modelValue?: string | number | boolean;
    value: string | number | boolean;
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: string | number | boolean): void;
    (event: 'change', value: string | number | boolean): void;
}>();

defineOptions({
    name: 'Radio',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<RadioProps>(), {
    disabled: false,
});

const checked = computed(() => props.modelValue === props.value);

const radioClassName = computed(() =>
    classNames(
        styles.radio,
        checked.value && styles['radio-checked'],
        props.disabled && styles['radio-disabled']
    )
);

const handleClick = () => {
    if (props.disabled || checked.value) return;
    emit('update:modelValue', props.value);
    emit('change', props.value);
};
</script>

<template>
    <button
        type="button"
        role="radio"
        :aria-checked="checked"
        :aria-disabled="disabled || undefined"
        :data-state="checked ? 'checked' : 'unchecked'"
        :class="radioClassName"
        :disabled="disabled"
        v-bind="$attrs"
        @click="handleClick"
    >
        <span :class="styles.outer">
            <span v-if="checked" :class="styles.inner" />
        </span>
        <span v-if="$slots.default" :class="styles.label">
            <slot />
        </span>
    </button>
</template>
