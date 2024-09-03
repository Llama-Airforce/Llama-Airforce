<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { header = "", disabled = false } = defineProps<{
  header?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <slot></slot>
</template>
