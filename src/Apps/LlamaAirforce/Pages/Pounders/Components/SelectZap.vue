<script setup lang="ts">
import type { Zap } from "@Pounders/Models";

const zap = defineModel<Zap>({
  required: true,
});

const { zaps } = defineProps<{
  zaps: Zap[];
}>();

const emit = defineEmits<{
  select: [zap: Zap];
}>();

// Methods
const icon = (logo: string): string => {
  return logo;
};

// Select
const onZapSelect = (option: Zap): void => {
  emit("select", option);
};

// Watches
watch(
  () => zaps,
  () => {
    if (zaps.length > 0) {
      onZapSelect(zaps[0]);
    }
  },
  { immediate: true }
);
</script>

<template>
  <Select
    :options="zaps"
    :selected="zap"
    @input="onZapSelect"
  >
    <template #item="{ item }">
      <div class="item">
        <img :src="icon(item.logo ?? '')" />
        <div class="label">{{ item.label ?? "?" }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
