<template>
  <div
    class="collapsible-content"
    :class="{ expanded }"
  >
    <div class="collapsible-inside">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  expanded: boolean;
}

const { expanded = true } = defineProps<Props>();
</script>

<style lang="scss" scoped>
.collapsible-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: 0s;
  overflow: hidden;

  &.expanded {
    grid-template-rows: 1fr;
  }

  > .collapsible-inside {
    min-height: 0;
  }
}
</style>
