<script setup lang="ts">
import styles from './list.module.less';

export interface ListItem {
    title: string;
    description?: string;
}

export interface ListProps {
    items: Array<string | ListItem>;
}

defineOptions({
    name: 'List',
    inheritAttrs: false,
});

const props = defineProps<ListProps>();

const getTitle = (item: string | ListItem) =>
    typeof item === 'string' ? item : item.title;

const getDescription = (item: string | ListItem) =>
    typeof item === 'string' ? '' : item.description ?? '';
</script>

<template>
    <ul :class="styles.list" role="list" v-bind="$attrs">
        <li
            v-for="(item, index) in props.items"
            :key="`${getTitle(item)}-${index}`"
            :class="styles.item"
        >
            <span :class="styles.marker" aria-hidden="true" />
            <div :class="styles.content">
                <div :class="styles.title">
                    {{ getTitle(item) }}
                </div>
                <div v-if="getDescription(item)" :class="styles.description">
                    {{ getDescription(item) }}
                </div>
            </div>
        </li>
    </ul>
</template>
