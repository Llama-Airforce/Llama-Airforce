<template>
  <Card :title="t('title')">
    <DataTable
      class="liq-overview-table"
      :rows
    >
      <template #row="{ item: { description, value, type } }: { item: Row }">
        <div>{{ description }}</div>

        <div
          v-if="type === 'collateral'"
          class="end"
        >
          <AsyncValue
            :value="value[0]"
            :show-zero="true"
            type="dollar"
          />

          /

          <AsyncValue
            :value="value[1]"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div
          v-else
          class="end"
        >
          <AsyncValue
            v-if="type === 'bad-debt'"
            class="red"
            :value="value"
            :show-zero="true"
            :inline="false"
            type="dollar"
          />
          <AsyncValue
            v-else-if="type !== 'number'"
            :value="value"
            :show-zero="true"
            :type
          />
          <span v-else>{{ value }}</span>
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { type LiqOverview } from "@CM/Services/Liquidations";

const { t } = useI18n();

// Props
interface Props {
  overview: LiqOverview | undefined;
}

const { overview } = defineProps<Props>();

type RowBase = {
  description: string;
};
type RowBadDebt = RowBase & {
  value: number;
  type: "bad-debt";
};
type RowOther = RowBase & {
  value: number;
  type: "percentage" | "dollar" | "number";
};
type RowCollateral = RowBase & {
  type: "collateral";
  value: [number, number];
};
type Row = RowOther | RowCollateral | RowBadDebt;

const badDebt = computed((): Row[] => {
  if (!overview) {
    return [];
  }

  const debt = overview.liqableDebtUsd;
  const collateral = overview.liqableCollatUsd + overview.liqableBorrowedUsd;
  const value = debt - collateral;

  if (value <= 0) {
    return [];
  }

  return [
    {
      description: "Bad debt",
      value,
      type: "bad-debt",
    },
  ];
});

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
    description: "Liquidatable collateral (token / crvUSD)",
    value: [
      overview?.liqableCollatUsd ?? 0,
      overview?.liqableBorrowedUsd ?? 0,
    ] as const,
    type: "collateral",
  },
  ...badDebt.value,
]);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liq-overview-table {
  --columns-data: 1fr auto;

  .red {
    color: var(--c-red);
  }
}
</style>

<i18n lang="yaml" locale="en">
title: General Health Metrics
</i18n>
