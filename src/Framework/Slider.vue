<script setup lang="ts">
const modelValue = defineModel<number>({
  required: true,
  set(value: string | number) {
    return Number(value);
  },
});

const { min, max } = defineProps<{
  min: number;
  max: number;
}>();
</script>

<template>
  <input
    v-model="modelValue"
    type="range"
    :min="min"
    :max="max"
  />
</template>

<style scoped>
input {
  -webkit-appearance: none;
  height: 0.75rem;
  background: var(--c-lvl2);
  border-radius: var(--border-radius);
  outline-color: transparent;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--c-primary);
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    background: var(--c-primary);
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  &:disabled {
    &::-webkit-slider-thumb {
      background: var(--c-lvl6);
    }
  }
}
</style>
