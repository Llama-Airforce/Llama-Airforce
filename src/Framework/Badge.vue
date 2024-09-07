<script setup lang="ts">
const { label = "" } = defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="badge">
    <div class="label">{{ label }}</div>
  </div>
</template>

<style lang="scss" scoped>
.badge {
  color: var(--c-text);
  font-size: 0.625rem;
  background: var(--c-primary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius);
}
</style>
