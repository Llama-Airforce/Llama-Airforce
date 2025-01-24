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
const icon = (logo: string) => logo;

// Select
const onZapSelect = (option: Zap) => {
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
    @select="onZapSelect"
  >
    <template #option="{ option }">
      <div class="option">
        <img :src="icon(option.logo ?? '')" />
        <div class="label">{{ option.label ?? "?" }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.option {
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
