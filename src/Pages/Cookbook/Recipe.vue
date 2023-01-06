<template>
  <div class="item">
    <slot name="example"></slot>
    <div class="title">{{ title }}</div>
    <slot name="snippets"></slot>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  title: string;
}

const { title } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.item {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: 1rem;
}
</style>
