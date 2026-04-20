import { computed, ref, watch, type Ref } from 'vue';

interface UseControllableOptions<T> {
    value: Ref<T | undefined>;
    defaultValue: T;
    onChange?: (value: T) => void;
}

export function useControllable<T>({
    value,
    defaultValue,
    onChange,
}: UseControllableOptions<T>): {
    currentValue: Ref<T>;
    setValue: (nextValue: T) => void;
} {
    const innerValue = ref(defaultValue) as Ref<T>;

    watch(
        value,
        (nextValue) => {
            if (nextValue !== undefined) {
                innerValue.value = nextValue;
            }
        },
        { immediate: true }
    );

    const currentValue = computed(() =>
        value.value !== undefined ? value.value : innerValue.value
    ) as Ref<T>;

    const setValue = (nextValue: T) => {
        if (value.value === undefined) {
            innerValue.value = nextValue;
        }
        onChange?.(nextValue);
    };

    return {
        currentValue,
        setValue,
    };
}
