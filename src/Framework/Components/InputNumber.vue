<script setup lang="ts">
const modelValue = defineModel<number | null | string>({
  required: true,
  default: null,
});

const {
  min = -Infinity,
  max = Infinity,
  decimals = 12,
} = defineProps<{
  min?: number;
  max?: number;
  decimals?: number;
}>();

watch(modelValue, (value) => {
  if (value === "") {
    modelValue.value = null;
  } else if (typeof value === "number") {
    const multiplier = Math.pow(10, decimals);
    const rounded = Math.floor(value * multiplier) / multiplier;
    modelValue.value = Math.min(Math.max(rounded, min), max);
  }
});
</script>

<template>
  <input
    v-model="modelValue"
    type="number"
    :min
    :max
  />
</template>

<style scoped>
input {
  all: unset;

  background-color: var(--c-lvl2);
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
    appearance: textfield;
  }
}
</style>
