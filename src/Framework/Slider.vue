<template>
  <input
    type="range"
    :min="min"
    :max="max"
    :value="modelValue"
    @input="onInput"
  />
</template>

<script setup lang="ts">
// Props
interface Props {
  modelValue: number;
  min: number;
  max: number;
}

const { modelValue, min, max } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
}>();

// Events
const onInput = (evt: Event): void => {
  emit("update:modelValue", (evt.target as HTMLInputElement).value);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
input {
  -webkit-appearance: none;
  width: 100%;
  height: 1rem;
  background: lighten($level1-color, 6%);
  outline: none;
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
    background: $blue;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    background: $blue;
    cursor: pointer;
  }

  &:disabled {
    &::-webkit-slider-thumb {
      background: $level6-color;
    }
  }
}
</style>
