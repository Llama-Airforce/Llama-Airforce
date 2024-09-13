<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false });

const { icon = "", value = "" } = defineProps<{
  icon?: string;
  value?: string;
}>();

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

<template>
  <Button
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
  </Button>
</template>

<style scoped>
button {
  .icon {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  &.toggled:not(:disabled) {
    --c-background: var(--c-variant, var(--c-primary));
    --c-states: var(--c-variant, var(--c-primary));
  }
}
</style>
