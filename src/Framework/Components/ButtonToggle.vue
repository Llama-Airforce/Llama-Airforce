<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  change: [toggled: boolean];
}>();
</script>

<template>
  <Button
    :class="{ toggled: modelValue }"
    @click="emit('change', !modelValue)"
  >
    <slot></slot>
  </Button>
</template>

<style scoped>
button {
  &.toggled:not(:disabled) {
    --c-background: var(--c-variant, var(--c-primary));
    --c-states: var(--c-variant, var(--c-primary));
  }
}
</style>
