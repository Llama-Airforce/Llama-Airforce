<script setup lang="ts" generic="T">
const {
  options,
  open,
  direction = "down",
} = defineProps<{
  options: T[];
  open: boolean;
  direction?: "up" | "down";
}>();

const emit = defineEmits<{
  select: [option: T];
}>();
</script>

<template>
  <div
    class="options-list"
    :class="[{ open }, direction]"
  >
    <div
      v-for="(option, idx) of options"
      :key="idx"
      class="option-wrapper"
      @click.stop="emit('select', option)"
    >
      <slot
        name="option"
        :option
        :idx
      >
        {{ option }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.options-list {
  color: var(--c-text);
  overflow: hidden;
  position: absolute;
  left: 0;
  z-index: 2;
  min-width: var(--options-min-width, 100%);
  font-size: 1rem;

  background: var(--c-lvl1);
  box-shadow: var(--options-box-shadow);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);

  &:not(.open) {
    display: none;
  }

  &.up {
    bottom: 120%; /* Items will move upwards. */

    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }
}

.option-wrapper {
  color: var(--c-text);
  cursor: pointer;

  /* Disable blue highlight because of pointer. */
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  border-bottom: 1px solid var(--c-lvl3);
  padding: 0.5rem 0.75rem;

  &:hover {
    background-color: var(--c-primary);
  }

  &:last-child {
    border-bottom: 0;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
}
</style>
