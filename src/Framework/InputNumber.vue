<template>
  <input
    v-model="modelValue"
    type="number"
    :min="min"
    :max="max"
  />
</template>

<script setup lang="ts">
// Props
interface Props {
  min: number;
  max: number;
}

const { min = -Infinity, max = Infinity } = defineProps<Props>();

const modelValue = defineModel<number | null | string>({
  required: true,
  default: null,
});

watch(modelValue, (newValue) => {
  if (newValue === "") {
    modelValue.value = null;
  } else if (typeof newValue === "number") {
    modelValue.value = Math.min(Math.max(newValue, min), max);
  }
});
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
  min-height: 2.5rem;
  cursor: text;

  transition: background-color 125ms ease;

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
