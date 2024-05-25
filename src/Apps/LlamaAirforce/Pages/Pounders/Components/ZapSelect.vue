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
    <template #item="props: { item: Zap }">
      <div
        v-if="props.item"
        class="item"
      >
        <img :src="icon(props.item.logo)" />
        <div class="label">{{ props.item.label }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { type Zap } from "@Pounders/Models/Zap";

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
const selectZapOpen = ref(false);
const zap = ref<Zap | null>(null);

// Hooks
onMounted((): void => {
  onZapSelect(zaps[0]);
});

// Methods
const icon = (logo: string): string => {
  return `${logo}`;
};

// Events
const onZapOpen = (): void => {
  selectZapOpen.value = !selectZapOpen.value;
};

const onZapSelect = (option: unknown): void => {
  zap.value = option as Zap;
  emit("select", zap.value);
};

// Watches
watch(
  () => zaps,
  () => {
    onZapSelect(zaps[0]);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
::v-deep(.select) {
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
