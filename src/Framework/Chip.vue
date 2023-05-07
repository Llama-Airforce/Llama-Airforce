<template>
  <div class="chip">
    <div class="label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  label: string;
}

const { label = "" } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chip {
  color: var(--c-text);
  font-size: 0.625rem;
  background: var(--c-primary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius);
}
</style>
