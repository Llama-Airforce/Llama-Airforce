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
    <template #item="props: { item: Zap | Swap }">
      <div
        v-if="props.item && isZap(props.item)"
        class="item"
      >
        <img :src="icon(props.item.logo)" />
        <div class="label">{{ props.item.label }}</div>
      </div>

      <div
        v-else-if="props.item && isSwap(props.item)"
        class="item"
      >
        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
        <div class="label">{{ t("other-token") }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import type { Zap, Swap } from "@Pounders/Models";
import { isZap, isSwap } from "@Pounders/Models";

const { t } = useI18n();

// Props
interface Props {
  zaps: (Zap | Swap)[];
}

const { zaps } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  select: [zap: Zap | Swap];
}>();

// Refs
const zap = defineModel<Zap | Swap | undefined>({
  required: true,
  default: undefined,
});
const selectZapOpen = ref(false);

// Methods
const icon = (logo: string): string => {
  return `${logo}`;
};

// Events
const onZapOpen = (): void => {
  selectZapOpen.value = !selectZapOpen.value;
};

const onZapSelect = (option: Zap | Swap): void => {
  emit("select", option);
};

// Watches
watch(
  () => zaps,
  () => {
    if (zaps && zaps.length > 0) {
      onZapSelect(zaps[0]);
    }
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

<i18n lang="yaml" locale="en">
other-token: Other Token
</i18n>

<i18n lang="yaml" locale="zh">
other-token: 其他代币
</i18n>

<i18n lang="yaml" locale="fr">
other-token: Autre Token
</i18n>
