<template>
  <Select
    class="select"
    :options="collaterals"
    :selected="collateralSelected"
    :open="collateralOpen"
    @open="onCollateralOpen"
    @close="collateralOpen = false"
    @input="onCollateralSelect"
  >
    <template #item="props: { item: CollateralInfo }">
      <div
        v-if="props.item"
        class="item"
      >
        <img
          v-if="icon(props.item.collateral)"
          :src="icon(props.item.collateral)"
        />
        <div
          v-else
          class="empty"
        ></div>

        <div class="label">{{ label(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Select } from "@/Framework";
import { type Collateral, icon } from "@PM/Models/Collateral";

type SelectItem = {
  label: string;
};

type CollateralInfo = SelectItem & {
  collateral: Collateral | "all";
};

// Props
interface Props {
  collateral: Collateral | "all" | null;
  all?: boolean;
}

const { collateral = null, all = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "select-collateral": [collateral: Collateral | "all"];
}>();

// Refs
const collateralOpen = ref(false);

const collaterals: CollateralInfo[] = [
  ...(all ? [{ collateral: "all" as const, label: "All" }] : []),
  { collateral: "cbETH", label: "cbETH" },
  { collateral: "wstETH", label: "wstETH" },
  { collateral: "rETH", label: "rETH" },
  { collateral: "sfrxETH", label: "sfrxETH" },
];

const collateralSelected = computed(
  (): CollateralInfo | null =>
    collaterals.find((p) => p.collateral === collateral) ?? null
);

// Hooks
onMounted((): void => {
  onCollateralSelect(collaterals[0]);
});

// Methods
const label = (item: SelectItem): string => item.label;

// Events
const onCollateralOpen = (): void => {
  collateralOpen.value = !collateralOpen.value;
};

const onCollateralSelect = (option: unknown): void => {
  const { collateral } = option as CollateralInfo;
  emit("select-collateral", collateral);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

::v-deep(.select) {
  .item {
    display: flex;
    align-items: center;

    img,
    .empty {
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
