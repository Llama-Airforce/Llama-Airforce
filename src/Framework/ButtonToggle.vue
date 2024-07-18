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
// Model
const modelValue = defineModel<boolean>({ default: false });

// Props
interface Props {
  icon?: string;
  value?: string;
}

const { icon = "", value = "" } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  change: [toggled: boolean];
}>();

// Events
const onClick = (): void => {
  const newValue = !modelValue.value;
  modelValue.value = newValue;
  emit("change", newValue);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

button {
  all: unset;
  display: flex;
  align-items: center;
  line-height: 1;
  padding: 0.5rem 1rem;
  color: var(--c-text);
  background: var(--c-lvl1);
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  height: calc(40px - 1rem);

  border-radius: var(--border-radius);

  transition: background-color 125ms ease;

  .icon {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

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
