<script setup lang="ts">
const { message = "No data available" } = defineProps<{
  message?: string;
}>();
</script>

<template>
  <div class="no-data">
    <LucideSearchX class="icon" />

    <span class="message">
      <slot>{{ message || "No data available" }}</slot>
    </span>
  </div>
</template>

<style scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--c-lvl5);
  gap: 1.5rem;

  .icon {
    width: 4rem;
    height: 4rem;
  }

  .message {
    font-size: 1rem;
  }
}
</style>
