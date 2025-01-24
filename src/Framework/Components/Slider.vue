<script setup lang="ts">
const modelValue = defineModel<number>({
  required: true,
  set(value: string | number) {
    return Number(value);
  },
});

const { min, max, step, disabled } = defineProps<{
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
}>();

const percentage = computed(
  () => ((modelValue.value - min) / (max - min)) * 100
);

// Thumb expansion
const isNearThumb = ref(false);
const slider = useTemplateRef<HTMLInputElement>("slider");

const handleMouseMove = (e: MouseEvent) => {
  if (!slider.value) {
    return;
  }

  const rect = slider.value.getBoundingClientRect();
  const thumbPosition = rect.left + (rect.width * percentage.value) / 100;
  const distance = Math.abs(e.clientX - thumbPosition);
  isNearThumb.value = distance < 30;
};
</script>

<template>
  <div
    class="slider-hitbox"
    @mousemove="handleMouseMove"
    @mouseleave="isNearThumb = false"
  >
    <input
      ref="slider"
      v-model="modelValue"
      type="range"
      :min
      :max
      :step
      :disabled
      :style="{
        '--progress': `${percentage}%`,
        '--thumb-scale': isNearThumb ? '1.2' : '1',
      }"
    />
  </div>
</template>

<style scoped>
.slider-hitbox {
  padding: 1rem;
  margin: -1rem;
}

input {
  --_color: var(--c-primary);

  &:disabled {
    --_color: var(--c-lvl6);

    &::-webkit-slider-thumb {
      background: var(--c-lvl6);
    }
  }

  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 0.5rem;
  border-radius: var(--border-radius);
  outline-color: transparent;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  background: linear-gradient(
    to right,
    var(--_color) 0%,
    var(--_color) var(--progress),
    var(--c-lvl2) var(--progress),
    var(--c-lvl2) 100%
  );

  &:not(:disabled):hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--_color);
    border-radius: var(--border-radius);
    cursor: pointer;

    transform: scale(var(--thumb-scale));
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    background: var(--_color);
    border-radius: var(--border-radius);
    cursor: pointer;

    transform: scale(var(--thumb-scale));
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>
