<script setup lang="ts">
const { expanded = false } = defineProps<{ expanded?: boolean }>();
</script>

<template>
  <LucideChevronUp
    class="expander"
    :class="{ expanded }"
  />
</template>

<style scoped>
.expander {
  color: var(--c-primary);
  animation: pulse 1000ms 2;

  transition: scale var(--hover-duration) ease-in-out,
    rotate 125ms cubic-bezier(0.65, 0.05, 0.36, 1);

  rotate: 90deg;

  &:hover,
  .row-data:hover & {
    /* .row-data from TableRow.vue */
    color: hsl(
      from var(--c-primary) h s calc(l + 6 * var(--color-scheme-dark))
    );
    scale: 1.25;
  }

  &.expanded {
    rotate: 180deg;
  }
}
</style>
