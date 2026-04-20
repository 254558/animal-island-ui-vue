<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import styles from './tabs.module.less';
import { classNames } from '@/internal/classNames';
import { useControllable } from '@/internal/useControllable';

export interface TabsItem {
    key: string;
    label: string;
    disabled?: boolean;
}

export interface TabsProps {
    activeKey?: string;
    defaultActiveKey?: string;
    items: TabsItem[];
}

const emit = defineEmits<{
    (event: 'update:activeKey', value: string): void;
    (event: 'change', value: string): void;
}>();

defineOptions({
    name: 'Tabs',
    inheritAttrs: false,
});

const props = defineProps<TabsProps>();
const instance = getCurrentInstance();
const rawProps = computed(() => instance?.vnode.props ?? {});
const tabRefs = ref<Array<HTMLButtonElement | null>>([]);

const controlledValue = computed(() =>
    'activeKey' in rawProps.value ? props.activeKey : undefined
);

const firstEnabledKey = computed(
    () => props.items.find((item) => !item.disabled)?.key ?? ''
);

const { currentValue, setValue } = useControllable<string>({
    value: controlledValue,
    defaultValue: props.defaultActiveKey ?? firstEnabledKey.value,
    onChange: (nextValue) => {
        emit('update:activeKey', nextValue);
        emit('change', nextValue);
    },
});

const focusActiveTab = async (key: string) => {
    await nextTick();
    const targetIndex = props.items.findIndex((item) => item.key === key);
    if (targetIndex >= 0) {
        tabRefs.value[targetIndex]?.focus();
    }
};

const handleClick = async (item: TabsItem) => {
    if (item.disabled || item.key === currentValue.value) return;
    setValue(item.key);
    await focusActiveTab(item.key);
};

const enabledItems = computed(() => props.items.filter((item) => !item.disabled));

const moveActive = async (direction: 1 | -1) => {
    const items = enabledItems.value;
    if (!items.length) return;

    const currentIndex = items.findIndex((item) => item.key === currentValue.value);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + direction + items.length) % items.length;
    setValue(items[nextIndex].key);
    await focusActiveTab(items[nextIndex].key);
};

const handleKeydown = async (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        await moveActive(1);
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        await moveActive(-1);
        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        const firstItem = enabledItems.value[0];
        if (firstItem) {
            setValue(firstItem.key);
            await focusActiveTab(firstItem.key);
        }
        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        const lastItem = enabledItems.value[enabledItems.value.length - 1];
        if (lastItem) {
            setValue(lastItem.key);
            await focusActiveTab(lastItem.key);
        }
    }
};
</script>

<template>
    <div
        :class="styles.tabs"
        role="tablist"
        aria-orientation="horizontal"
        v-bind="$attrs"
    >
        <button
            v-for="item in items"
            :key="item.key"
            :ref="
                (element) => {
                    tabRefs[items.findIndex((candidate) => candidate.key === item.key)] =
                        element as HTMLButtonElement | null;
                }
            "
            type="button"
            role="tab"
            :aria-selected="item.key === currentValue"
            :aria-disabled="item.disabled || undefined"
            :data-state="item.key === currentValue ? 'active' : 'inactive'"
            :tabindex="item.key === currentValue ? 0 : -1"
            :class="
                classNames(
                    styles.tab,
                    item.key === currentValue && styles['tab-active'],
                    item.disabled && styles['tab-disabled']
                )
            "
            :disabled="item.disabled"
            @click="handleClick(item)"
            @keydown="handleKeydown"
        >
            {{ item.label }}
        </button>
    </div>
</template>
