<template>
  <DataTable
    class="datatable-liq-overview"
    columns-data="liq-overview-columns-data"
    :rows
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="{ item: { description, value, type } }: { item: Row }">
      <div>{{ description }}</div>

      <div class="number">
        <AsyncValue
          v-if="type !== 'number'"
          :value="value"
          :show-zero="true"
          :type
        />
        <span v-else>{{ value }}</span>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type LiqOverview } from "@CM/Services/Liquidations";

const { t } = useI18n();

// Props
interface Props {
  overview: LiqOverview | undefined;
}

const { overview } = defineProps<Props>();

type Row = {
  description: string;
  value: number;
  type: "percentage" | "dollar" | "number";
};

const rows = computed((): Row[] => [
  {
    description: "Users in soft liquidation",
    value: overview?.softLiqUsers ?? 0,
    type: "number",
  },
  {
    description: "Median health",
    value: overview?.medianHealth ?? 0,
    type: "percentage",
  },
  {
    description: "Collaterization ratio",
    value: overview?.collatRatio ?? 0,
    type: "percentage",
  },
  {
    description: "Liquidatable positions",
    value: overview?.liqablePositions ?? 0,
    type: "number",
  },
  {
    description: "Liquidatable positions' debt",
    value: overview?.liqableDebtUsd ?? 0,
    type: "dollar",
  },
  {
    description: "Liquidatable collateral",
    value: overview?.liqableCollatUsd ?? 0,
    type: "dollar",
  },
]);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-liq-overview {
  ::v-deep(.liq-overview-columns-data) {
    display: grid;
    grid-template-columns: 2fr 6fr;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: General Health Metrics
</i18n>
