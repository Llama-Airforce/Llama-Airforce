<template>
  <slot></slot>
</template>

<script setup lang="ts">
// Props
interface Props {
  header?: string;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { header = "", disabled = false } = defineProps<Props>();
</script>
