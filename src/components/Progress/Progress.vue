<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import styles from './progress.module.less';

export interface ProgressProps {
    /** 进度百分比，范围会被限制在 0 到 100。 */
    percent: number;
    /** 进度条状态样式。 */
    status?: 'default' | 'success' | 'warning';
    /** 是否从 0 播放到目标进度。 */
    animated?: boolean;
}

defineOptions({
    name: 'Progress',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<ProgressProps>(), {
    status: 'default',
    animated: false,
});

const safePercent = computed(() => Math.min(100, Math.max(0, props.percent)));
const displayPercent = ref(props.animated ? 0 : safePercent.value);
const decorativeDots = [10, 24, 38, 52, 66, 80, 94];
let animationTimer: ReturnType<typeof setTimeout> | null = null;

const clearAnimationTimer = () => {
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
};

watch(
    [safePercent, () => props.animated],
    ([nextPercent, animated]) => {
        clearAnimationTimer();

        if (!animated) {
            displayPercent.value = nextPercent;
            return;
        }

        displayPercent.value = 0;
        animationTimer = setTimeout(() => {
            displayPercent.value = nextPercent;
            animationTimer = null;
        }, 32);
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    clearAnimationTimer();
});
</script>

<template>
    <div
        :class="styles.progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="safePercent"
        :aria-valuetext="`${safePercent}%`"
        v-bind="$attrs"
    >
        <div :class="styles.track">
            <div :class="styles.rail">
                <span
                    v-for="dot in decorativeDots"
                    :key="dot"
                    :class="styles.dot"
                    :style="{ left: `${dot}%` }"
                />
                <div
                    data-progress-fill
                    :class="[styles.fill, styles[`fill-${status}`]]"
                    :style="{ width: `${displayPercent}%` }"
                />
            </div>
            <div
                data-progress-thumb
                :class="[styles.thumb, styles[`thumb-${status}`]]"
                :style="{ left: `${displayPercent}%` }"
            >
                <span :class="styles.thumbLeaf" />
            </div>
        </div>
        <div :class="styles.labelWrap">
            <span :class="styles.labelCaption">进度</span>
            <span :class="styles.label">{{ safePercent }}%</span>
        </div>
    </div>
</template>
