<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';
import styles from './pagination.module.less';

export interface PaginationProps {
    /** 当前页码。 */
    current?: number;
    /** 非受控模式下的默认页码。 */
    defaultCurrent?: number;
    /** 数据总数。 */
    total: number;
    /** 每页条数。 */
    pageSize?: number;
    /** 是否显示上一页和下一页按钮。 */
    showPrevNext?: boolean;
    /** 最多展示的页码按钮数量。 */
    maxVisible?: number;
}

const emit = defineEmits<{
    (event: 'update:current', value: number): void;
    (event: 'change', value: number): void;
}>();

defineOptions({
    name: 'Pagination',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationProps>(), {
    defaultCurrent: 1,
    pageSize: 10,
    showPrevNext: true,
    maxVisible: 7,
});

const instance = getCurrentInstance();

const controlledCurrent = computed(() => {
    const rawProps = instance?.vnode.props ?? {};
    return 'current' in rawProps ? props.current : undefined;
});

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

const { currentValue, setValue } = useControllable<number>({
    value: controlledCurrent,
    defaultValue: props.defaultCurrent,
    onChange: (nextValue) => {
        emit('update:current', nextValue);
        emit('change', nextValue);
    },
});

const safeCurrent = computed(() =>
    Math.min(totalPages.value, Math.max(1, currentValue.value ?? 1))
);

const pages = computed<(number | string)[]>(() => {
    const total = totalPages.value;
    const maxVisible = Math.max(5, props.maxVisible);

    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const innerWindow = maxVisible - 2;
    let start = Math.max(2, safeCurrent.value - Math.floor(innerWindow / 2));
    let end = start + innerWindow - 1;

    if (end > total - 1) {
        end = total - 1;
        start = end - innerWindow + 1;
    }

    const result: (number | string)[] = [1];

    if (start > 2) {
        result.push('ellipsis-left');
    }

    for (let page = start; page <= end; page += 1) {
        result.push(page);
    }

    if (end < total - 1) {
        result.push('ellipsis-right');
    }

    result.push(total);

    return result;
});

const handleClick = (page: number) => {
    if (page === safeCurrent.value) return;
    setValue(page);
};

const handleStep = (direction: -1 | 1) => {
    const nextPage = Math.min(totalPages.value, Math.max(1, safeCurrent.value + direction));

    if (nextPage === safeCurrent.value) {
        return;
    }

    setValue(nextPage);
};
</script>

<template>
    <nav :class="styles.pagination" aria-label="Pagination" v-bind="$attrs">
        <button
            v-if="showPrevNext"
            type="button"
            role="button"
            aria-label="上一页"
            :disabled="safeCurrent === 1"
            :class="[
                styles.item,
                styles.control,
                safeCurrent === 1 && styles['item-disabled'],
            ]"
            @click="handleStep(-1)"
        >
            上一页
        </button>
        <template v-for="page in pages" :key="String(page)">
            <button
                v-if="typeof page === 'number'"
                type="button"
                role="button"
                :aria-current="page === safeCurrent ? 'page' : undefined"
                :aria-label="`第 ${page} 页`"
                :data-state="page === safeCurrent ? 'active' : 'inactive'"
                :class="
                    classNames(
                        styles.item,
                        page === safeCurrent && styles['item-active']
                    )
                "
                @click="handleClick(page)"
            >
                {{ page }}
            </button>
            <span
                v-else
                :class="styles.ellipsis"
                aria-hidden="true"
            >
                …
            </span>
        </template>
        <button
            v-if="showPrevNext"
            type="button"
            role="button"
            aria-label="下一页"
            :disabled="safeCurrent === totalPages"
            :class="[
                styles.item,
                styles.control,
                safeCurrent === totalPages && styles['item-disabled'],
            ]"
            @click="handleStep(1)"
        >
            下一页
        </button>
    </nav>
</template>
