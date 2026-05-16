<script setup lang="ts">
import styles from './divider.module.less';

defineOptions({
    name: 'Divider',
    inheritAttrs: false,
});

</script>

<template>
    <div :class="styles.divider" v-bind="$attrs" />
</template>
