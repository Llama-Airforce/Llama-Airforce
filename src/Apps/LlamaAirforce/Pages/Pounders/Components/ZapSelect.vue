<template>
  <Select
    class="select"
    :options="zaps"
    :selected="zap"
    :open="selectZapOpen"
    @open="onZapOpen"
    @close="selectZapOpen = false"
    @input="onZapSelect"
  >
    <template #item="props: { item: Zap | undefined }">
      <div class="item">
        <img :src="icon(props.item?.logo ?? '')" />
        <div class="label">{{ props.item?.label ?? "?" }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import type { Zap } from "@Pounders/Models";

// Props
interface Props {
  zaps: Zap[];
}

const { zaps } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  select: [zap: Zap];
}>();

// Refs
const zap = defineModel<Zap | undefined>({
  required: true,
  default: undefined,
});
const selectZapOpen = ref(false);

// Methods
const icon = (logo: string): string => {
  return logo;
};

// Events
const onZapOpen = (): void => {
  selectZapOpen.value = !selectZapOpen.value;
};

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
:deep(.select) {
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
}
</style>
