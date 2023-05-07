<template>
  <input
    type="number"
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
  all: unset;

  background-color: var(--input-background);
  border: solid var(--border-thickness) var(--c-lvl4);
  border-radius: var(--border-radius);
  box-shadow: var(--input-box-shadow);

  padding: 0rem 0.875rem;
  text-align: start;
  height: 2.5rem;
  cursor: text;

  &::placeholder {
    color: var(--c-lvl5);
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  &:hover,
  &:focus-visible {
    background-color: var(--input-background-hover);
    border-color: var(--c-lvl4-hover);
  }

  &:active {
    background-color: var(--input-background-active);
    border-color: var(--c-lvl4-active);
  }
}
</style>
