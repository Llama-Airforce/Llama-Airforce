<script setup lang="ts">
const { title, description } = defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
    margin: 0;
  }
}
</style>
