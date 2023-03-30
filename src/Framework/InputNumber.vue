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
  background-color: $datatable-background;
  border: solid 2px var(--c-lvl4);
  padding: 0.1rem 0.5rem;
  text-align: start;
  height: 2rem;
  cursor: text;

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

  &:hover {
    background-color: $datatable-background-hover;
    border-color: var(--c-lvl4-hover);
  }

  &:active {
    background-color: $datatable-background-active;
    border-color: var(--c-lvl4-active);
  }
}
</style>
