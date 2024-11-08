<script setup lang="ts">
defineProps<{
  header?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <slot></slot>
</template>
