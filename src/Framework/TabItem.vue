<template>
  <slot></slot>
</template>

<script setup lang="ts">
// Props
interface Props {
  header?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { header = "" } = defineProps<Props>();
</script>
