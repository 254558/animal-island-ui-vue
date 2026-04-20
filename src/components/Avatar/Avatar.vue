<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import styles from './avatar.module.less';
import { classNames } from '@/internal/classNames';

export type AvatarSize = 'small' | 'default' | 'large';

export interface AvatarProps {
    src?: string;
    alt?: string;
    size?: AvatarSize;
}

defineOptions({
    name: 'Avatar',
    inheritAttrs: false,
});

const props = withDefaults(defineProps<AvatarProps>(), {
    size: 'default',
    alt: '',
});

const imageFailed = ref(false);
const fallbackText = computed(() => props.alt.trim().charAt(0).toUpperCase());
const showImage = computed(() => Boolean(props.src) && !imageFailed.value);
const avatarClassName = computed(() =>
    classNames(styles.avatar, styles[`avatar-${props.size}`])
);

watch(
    () => props.src,
    () => {
        imageFailed.value = false;
    }
);

const handleImageError = () => {
    imageFailed.value = true;
};
</script>

<template>
    <span
        :class="avatarClassName"
        role="img"
        :aria-label="alt || undefined"
        :data-state="showImage ? 'image' : 'fallback'"
        v-bind="$attrs"
    >
        <img
            v-if="showImage"
            :src="src"
            :alt="alt"
            :class="styles.image"
            loading="lazy"
            @error="handleImageError"
        />
        <span v-else :class="styles.fallback">{{ fallbackText }}</span>
    </span>
</template>
