<template>
  <button
    :class="{ toggled: modelValue }"
    @click="onClick"
  >
    <slot>
      <i
        v-if="icon"
        class="icon"
        :class="icon"
      >
      </i>
      {{ value }}
    </slot>
  </button>
</template>

<script setup lang="ts">
// Props
interface Props {
  modelValue: boolean;
  icon?: string;
  value?: string;
}

const { modelValue = false, icon = "", value = "" } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

// Events
const onClick = (): void => {
  emit("update:modelValue", !modelValue);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

button {
  all: unset;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--c-text);
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  height: calc(40px - 1rem);

  border-radius: var(--border-radius);

  .icon {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  background: var(--c-lvl1);

  &:disabled {
    pointer-events: none;
    background: var(--c-primary-disabled);
  }

  &:hover:not(:disabled) {
    background: var(--container-background-hover);
  }

  &:active:not(:disabled) {
    background: var(--container-background-active);
  }

  &.toggled:not(:disabled) {
    background-color: var(--c-primary);

    &:hover {
      background-color: var(--c-primary-hover);
    }

    &:active {
      background-color: var(--c-primary-active);
    }
  }
}
</style>
