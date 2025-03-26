<script setup lang="ts">
const { expanded = true } = defineProps<{
  expanded?: boolean;
}>();
</script>

<template>
  <div
    class="collapsible-outside"
    :class="{ expanded }"
  >
    <div class="collapsible-inside">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.collapsible-outside {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0s;
  overflow: hidden;

  &.expanded {
    grid-template-rows: 1fr;
  }

  > .collapsible-inside {
    display: flex;
    flex-direction: column;

    min-height: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
