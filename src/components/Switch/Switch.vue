<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import styles from './switch.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export type SwitchSize = 'small' | 'default';

/**
 * 布尔状态开关。
 * 适合开启提醒、展示状态或配置项切换。
 */
export interface SwitchProps {
    /** 推荐使用的双向绑定值。 */
    modelValue?: boolean;
    /** 兼容受控写法的值。 */
    checked?: boolean;
    /** 非受控模式下的默认选中状态。 */
    defaultChecked?: boolean;
    /** 开关尺寸。 */
    size?: SwitchSize;
    /** 是否禁用。 */
    disabled?: boolean;
    /** 是否显示加载态。 */
    loading?: boolean;
    /** 选中状态下展示的文案。 */
    checkedChildren?: string;
    /** 未选中状态下展示的文案。 */
    unCheckedChildren?: string;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
    (event: 'update:checked', value: boolean): void;
    (event: 'change', value: boolean): void;
}>();

defineOptions({
    name: 'Switch',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<SwitchProps>(), {
    defaultChecked: false,
    size: 'default',
    disabled: false,
    loading: false,
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

const switchClassName = computed(() =>
    classNames(
        styles.switch,
        styles[`switch-${props.size}`],
        currentValue.value && styles['switch-checked'],
        props.disabled && styles['switch-disabled'],
        props.loading && styles['switch-loading']
    )
);

const handleClick = () => {
    if (props.disabled || props.loading) return;
    setValue(!currentValue.value);
};
</script>

<template>
    <button
        type="button"
        role="switch"
        :aria-checked="currentValue"
        :class="switchClassName"
        :disabled="disabled"
        v-bind="$attrs"
        @click="handleClick"
    >
        <span :class="styles.handle">
            <span v-if="loading" :class="styles.spinner" />
        </span>
        <span :class="styles.inner">
            <slot v-if="currentValue" name="checked">{{ checkedChildren }}</slot>
            <slot v-else name="unchecked">{{ unCheckedChildren }}</slot>
        </span>
    </button>
</template>
