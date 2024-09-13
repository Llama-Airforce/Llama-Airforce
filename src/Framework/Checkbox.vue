<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  change: [checked: boolean];
}>();

// Events
const onChange = (evt: Event): void => {
  const checked = (evt.target as HTMLInputElement).checked;
  modelValue.value = checked;
  emit("change", checked);
};
</script>

<template>
  <label class="checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
    />

    <span
      class="checkmark"
      :class="{ checked: modelValue }"
      role="checkbox"
      :aria-checked="modelValue"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <span class="checkmark-label"><slot></slot></span>
  </label>
</template>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;

  cursor: pointer;
  user-select: none;

  /* We hide the native display as we have our custom implementation. */
  input {
    display: none;
  }

  .checkmark {
    display: flex;
    justify-content: center;
    align-items: center;

    --check-border-thickness: max(1px, var(--border-thickness));

    height: calc(1.125rem - var(--check-border-thickness));
    width: calc(1.125rem - var(--check-border-thickness));
    background-color: var(--c-lvl2);
    border: solid max(1px, var(--check-border-thickness)) var(--c-lvl4);
    border-radius: min(var(--border-radius), 25%);

    transition: all 0.2s ease-in-out;

    svg {
      margin-top: 1px; /* Half the SVG stroke width. */
      width: 1rem;
      height: 1rem;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
  }

  &:hover input ~ .checkmark {
    background-color: hsl(
      from var(--c-lvl2) h s calc(l + 6 * var(--color-scheme-dark))
    );

    border-color: hsl(
      from var(--c-lvl4) h s calc(l + 6 * var(--color-scheme-dark))
    );
  }

  input:checked ~ .checkmark {
    background-color: var(--c-primary);
    border-color: var(--c-primary);

    svg {
      opacity: 1;
      color: var(--c-text);
    }
  }

  input:checked:hover ~ .checkmark {
    background-color: hsl(
      from var(--c-primary) h s calc(l + 6 * var(--color-scheme-dark))
    );

    border-color: hsl(
      from var(--c-primary) h s calc(l + 6 * var(--color-scheme-dark))
    );
  }

  .checkmark-label {
    margin-top: 1px;

    &:empty {
      display: none;
    }
  }
}
</style>
