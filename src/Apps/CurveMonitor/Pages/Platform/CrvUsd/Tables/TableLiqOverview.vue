<template>
  <DataTable
    class="datatable-liq-overview"
    columns-data="liq-overview-columns-data"
    :loading
    :rows
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="{ item: { description, value, type } }: { item: Row }">
      <div>{{ t(description) }}</div>

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
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/CrvUsd";
import { useQueryMarketHealth } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  chain: Chain | undefined;
  market: Market | undefined;
}

const { market, chain } = defineProps<Props>();

// Data
const { isFetching: loading, data: marketState } = useQueryMarketHealth(
  toRef(() => chain),
  toRef(() => market)
);

type Row = {
  description: string;
  value: number;
  type: "percentage" | "dollar" | "number";
};

const rows = computed((): Row[] => [
  {
    description: "Users in soft liquidation",
    value: marketState.value?.softLiqUsers ?? 0,
    type: "number",
  },
  {
    description: "Median health",
    value: marketState.value?.medianHealth ?? 0,
    type: "percentage",
  },
  {
    description: "Collaterization ratio",
    value: marketState.value?.collatRatio ?? 0,
    type: "percentage",
  },
  {
    description: "Liquidatable positions",
    value: marketState.value?.liqablePositions ?? 0,
    type: "number",
  },
  {
    description: "Liquidatable positions' debt",
    value: marketState.value?.liqableDebtUsd ?? 0,
    type: "dollar",
  },
  {
    description: "Liquidatable collateral",
    value: marketState.value?.liqableCollatUsd ?? 0,
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
