<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue';
import styles from './rate.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export interface RateProps {
    /** 推荐使用的双向绑定值。 */
    modelValue?: number;
    /** 兼容受控写法的值。 */
    value?: number;
    /** 非受控模式下的默认值。 */
    defaultValue?: number;
    /** 评分项总数。 */
    count?: number;
    /** 是否支持半分。 */
    allowHalf?: boolean;
    /** 是否禁用。 */
    disabled?: boolean;
}

const emit = defineEmits<{
    (event: 'update:modelValue', value: number): void;
    (event: 'change', value: number): void;
}>();

defineOptions({
    name: 'Rate',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<RateProps>(), {
    defaultValue: 0,
    count: 5,
    allowHalf: false,
    disabled: false,
});

const instance = getCurrentInstance();
const rawProps = computed(() => instance?.vnode.props ?? {});

const controlledValue = computed(() =>
    'modelValue' in rawProps.value
        ? props.modelValue
        : 'value' in rawProps.value
          ? props.value
          : undefined
);

const { currentValue, setValue } = useControllable<number>({
    value: controlledValue,
    defaultValue: props.defaultValue,
    onChange: (nextValue) => {
        emit('update:modelValue', nextValue);
        emit('change', nextValue);
    },
});

const hoveredValue = ref<number | null>(null);

const normalizeScore = (value: number) => {
    const safeValue = Math.min(props.count, Math.max(0, value));
    if (!props.allowHalf) {
        return Math.round(safeValue);
    }
    return Math.round(safeValue * 2) / 2;
};

const safeCurrentValue = computed(() =>
    normalizeScore(currentValue.value ?? 0)
);

const displayValue = computed(() => hoveredValue.value ?? safeCurrentValue.value);

const items = computed(() =>
    Array.from({ length: props.count }, (_, index) => index + 1)
);

const resolvePointerScore = (score: number, event: MouseEvent) => {
    if (!props.allowHalf) {
        return score;
    }

    const currentTarget = event.currentTarget as HTMLElement | null;
    if (!currentTarget) {
        return score;
    }

    const rect = currentTarget.getBoundingClientRect();
    const fallbackWidth = 24;
    const relativeX =
        typeof event.offsetX === 'number'
            ? event.offsetX
            : rect.width > 0
              ? event.clientX - rect.left
              : event.clientX;
    const threshold = rect.width > 0 ? rect.width / 2 : fallbackWidth / 2;

    return relativeX <= threshold ? score - 0.5 : score;
};

const getItemState = (score: number, value: number) => {
    if (value >= score) {
        return 'full';
    }

    if (props.allowHalf && value >= score - 0.5) {
        return 'half';
    }

    return 'empty';
};

const isItemActive = (score: number, value: number) =>
    getItemState(score, value) !== 'empty';

const handleClick = (score: number, event: MouseEvent) => {
    if (props.disabled) return;
    hoveredValue.value = null;
    setValue(normalizeScore(resolvePointerScore(score, event)));
};

const handleMouseEnter = (score: number) => {
    if (props.disabled) return;
    hoveredValue.value = score;
};

const handleMouseMove = (score: number, event: MouseEvent) => {
    if (props.disabled) return;
    hoveredValue.value = normalizeScore(resolvePointerScore(score, event));
};

const handleMouseLeave = () => {
    hoveredValue.value = null;
};

const handleKeydown = (event: KeyboardEvent) => {
    if (props.disabled) return;

    const step = props.allowHalf ? 0.5 : 1;
    const currentScore = safeCurrentValue.value;
    let nextScore = currentScore > 0 ? currentScore : step;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        nextScore = Math.min(props.count, nextScore + step);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        nextScore = Math.max(step, nextScore - step);
    } else if (event.key === 'Home') {
        nextScore = step;
    } else if (event.key === 'End') {
        nextScore = props.count;
    } else {
        return;
    }

    event.preventDefault();
    hoveredValue.value = null;
    setValue(normalizeScore(nextScore));
    (event.currentTarget as HTMLButtonElement | null)?.parentElement
        ?.querySelectorAll<HTMLButtonElement>('button[role="radio"]')
        [Math.max(0, Math.ceil(nextScore) - 1)]?.focus();
};

const getTabIndex = (score: number) => {
    const focusScore =
        safeCurrentValue.value > 0 ? Math.ceil(safeCurrentValue.value) : 1;
    return score === focusScore ? 0 : -1;
};
</script>

<template>
    <div
        :class="styles.rate"
        role="radiogroup"
        aria-label="评分"
        v-bind="$attrs"
        @mouseleave="handleMouseLeave"
    >
        <button
            v-for="score in items"
            :key="score"
            data-rate-item
            type="button"
            role="radio"
            :aria-checked="
                safeCurrentValue > 0 &&
                score === Math.ceil(safeCurrentValue)
                    ? 'true'
                    : 'false'
            "
            :aria-label="`评分 ${score}`"
            :data-active="isItemActive(score, displayValue) ? 'true' : 'false'"
            :data-half="getItemState(score, displayValue) === 'half' ? 'true' : 'false'"
            :tabindex="getTabIndex(score)"
            :class="
                classNames(
                    styles.item,
                    isItemActive(score, displayValue) && styles['item-active'],
                    getItemState(score, displayValue) === 'half' && styles['item-half'],
                    hoveredValue !== null &&
                        isItemActive(score, hoveredValue) &&
                        styles['item-preview'],
                    disabled && styles['item-disabled']
                )
            "
            :disabled="disabled"
            @mouseenter="handleMouseEnter(score)"
            @mousemove="handleMouseMove(score, $event)"
            @click="handleClick(score, $event)"
            @keydown="handleKeydown($event)"
        >
            <span :class="styles.itemInner">
                <span :class="styles.leaf" />
            </span>
        </button>
    </div>
</template>
