<script setup lang="ts" generic="T extends readonly unknown[]">
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const modelValue = defineModel<T[number] | undefined>({ required: true });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { value, name } = defineProps<{
  values: T;
  value: T[number];
  name: string;
}>();

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

<style scoped>
.radio {
  display: flex;
  align-items: center;
  gap: 1rem;

  cursor: pointer;
  user-select: none;

  /* We hide the native display as we have our custom implementation. */
  input {
    display: none;
  }

  .radio-mark {
    position: relative;

    height: calc(1.125rem - var(--border-thickness));
    width: calc(1.125rem - var(--border-thickness));
    background-color: var(--c-lvl2);
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
    background-color: hsl(
      from var(--c-lvl2) h s calc(l + 6 * var(--color-scheme-dark))
    );

    border-color: hsl(
      from var(--c-lvl4) h s calc(l + 6 * var(--color-scheme-dark))
    );
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
