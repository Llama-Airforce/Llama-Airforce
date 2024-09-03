<script setup lang="ts" generic="T extends readonly unknown[]">
const { value, name } = defineProps<{
  values: T;
  value: T[number];
  name: string;
}>();

// Model
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const modelValue = defineModel<T[number] | undefined>({ required: true });

// Emits
const emit = defineEmits<{
  change: [value: T[number]];
}>();

// Events
const onChange = (evt: Event): void => {
  const checked = (evt.target as HTMLInputElement).checked;
  if (checked) {
    modelValue.value = value;
  }
  emit("change", value);
};
</script>

<template>
  <label class="radio">
    <input
      type="radio"
      :checked="modelValue === value"
      :value
      :name
      @change="onChange"
    />

    <span
      class="radio-mark"
      :class="{ checked: modelValue === value }"
      role="radio"
      :aria-checked="modelValue === value"
    >
      <span class="inner-circle"></span>
    </span>

    <span class="radio-label"><slot></slot></span>
  </label>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.radio {
  display: flex;
  align-items: center;
  gap: 1rem;

  cursor: pointer;
  user-select: none;

  // We hide the native display as we have our custom implementation.
  input {
    display: none;
  }

  .radio-mark {
    position: relative;

    height: 16px;
    width: 16px;
    background-color: var(--input-background);
    border: solid var(--border-thickness) var(--c-lvl4);
    border-radius: 50%;

    transition: all 0.2s ease-in-out;

    .inner-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);

      width: 8px;
      height: 8px;
      background-color: var(--c-text);
      border-radius: 50%;
      opacity: 0;
      transition: all 0.2s ease-in-out;
    }
  }

  &:hover input ~ .radio-mark {
    background-color: var(--input-background-hover);
    border-color: var(--input-border-color-hover);
  }

  input:checked ~ .radio-mark {
    background-color: var(--c-primary);
    border-color: var(--c-primary);

    .inner-circle {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  input:checked:hover ~ .radio-mark {
    background-color: var(--c-primary-hover);
    border-color: var(--c-primary-hover);
  }

  .radio-label {
    margin-top: 1px;

    &:empty {
      display: none;
    }
  }
}
</style>
