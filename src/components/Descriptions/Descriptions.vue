<script setup lang="ts">
import styles from './descriptions.module.less';

export interface DescriptionsItem {
    label: string;
    value: string;
}

export interface DescriptionsProps {
    items: DescriptionsItem[];
}

defineOptions({
    name: 'Descriptions',
    inheritAttrs: false,
});

defineProps<DescriptionsProps>();
</script>

<template>
    <div :class="styles.descriptions" role="list" v-bind="$attrs">
        <div
            v-for="(item, index) in items"
            :key="`${item.label}-${index}`"
            :class="styles.row"
            role="listitem"
            data-descriptions-item
        >
            <div :class="styles.label">{{ item.label }}</div>
            <div :class="styles.value">{{ item.value }}</div>
        </div>
    </div>
</template>
