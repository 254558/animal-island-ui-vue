<script setup lang="ts">
import { ref, useId } from 'vue';
import styles from './collapse.module.less';
import { classNames } from '@/internal/classNames';

export interface CollapseProps {
    /** 折叠面板标题。 */
    question?: string;
    /** 折叠面板内容。 */
    answer?: string;
    /** 是否默认展开。 */
    defaultExpanded?: boolean;
    /** 是否禁用。 */
    disabled?: boolean;
}

defineOptions({
    name: 'Collapse',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<CollapseProps>(), {
    defaultExpanded: false,
    disabled: false,
});

const expanded = ref(props.defaultExpanded);
const contentId = useId();

const toggle = () => {
    if (props.disabled) return;
    expanded.value = !expanded.value;
};
</script>

<template>
    <div
        :class="
            classNames(
                styles.faqCard,
                expanded && styles.expanded,
                disabled && styles.disabled
            )
        "
        v-bind="$attrs"
    >
        <button
            :class="styles.questionHeader"
            :disabled="disabled"
            :aria-expanded="expanded"
            :aria-controls="contentId"
            @click="toggle"
        >
            <span :class="styles.questionIcon" data-icon-shape="round">
                <span :class="styles.questionIconGlyph">
                    {{ expanded ? '−' : '+' }}
                </span>
            </span>
            <span :class="styles.questionText">
                <slot name="question">{{ question }}</slot>
            </span>
            <span :class="styles.leafDecoration">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                        fill="currentColor"
                        d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
                    />
                </svg>
            </span>
        </button>
        <div
            :id="contentId"
            :class="styles.answerWrapper"
            data-collapse-content
            role="region"
            :data-state="expanded ? 'open' : 'closed'"
        >
            <div :class="styles.answerContent">
                <slot>{{ answer }}</slot>
            </div>
        </div>
    </div>
</template>
