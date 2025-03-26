<script setup lang="ts">
const { expanded = false } = defineProps<{
  expanded?: boolean;
}>();
</script>

<template>
  <nav :class="{ expanded }">
    <slot></slot>
  </nav>
</template>

<style scoped>
nav {
  height: 100vh;
  height: 100dvh;

  display: grid;
  grid-template-columns: 18.125rem;
  grid-template-rows: 6.25rem 1fr auto;

  background: var(--c-lvl1);
  user-select: none;

  @media only screen and (max-width: 1280px) {
    width: 100vw;
    width: 100dvw;
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: 4rem 1fr auto;

    &.expanded {
      height: 100vh;
      height: 100dvh;
    }
  }
}
</style>
