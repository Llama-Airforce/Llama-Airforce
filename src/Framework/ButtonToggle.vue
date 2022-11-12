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
  color: $text;
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  height: calc(40px - 1rem);

  border: solid 2px #35353b;
  border-radius: 0;

  .icon {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  background: $background-color-widget;

  &:disabled {
    pointer-events: none;
    background: lighten($blue, 15%);
  }

  &:hover:not(:disabled) {
    background: $datatable-background-hover;
  }

  &:active:not(:disabled) {
    background: $datatable-background-active;
  }

  &.toggled:not(:disabled) {
    background-color: $blue;

    &:hover {
      background-color: lighten($blue, 10%);
    }

    &:active {
      background-color: lighten($blue, 20%);
    }
  }
}
</style>
