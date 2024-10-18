<script setup lang="ts">
import { type LiqOverview } from "@CM/Services/Liquidations";

const { overview } = defineProps<{
  overview: LiqOverview | undefined;
}>();

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

<template>
  <Card title="General Health Metrics">
    <Table
      class="liq-overview-table"
      :rows
    >
      <template #row="{ item: { description, value, type } }">
        <div>{{ description }}</div>

        <div
          v-if="type === 'collateral'"
          class="collateral end"
        >
          <AsyncValue
            show-zero
            type="dollar"
            :value="value[0]"
          />

          /

          <AsyncValue
            show-zero
            type="dollar"
            :value="value[1]"
          />
        </div>

        <div
          v-else
          class="end"
        >
          <AsyncValue
            v-if="type === 'bad-debt'"
            show-zero
            class="red"
            type="dollar"
            :value
          />
          <AsyncValue
            v-else-if="type !== 'number'"
            show-zero
            :value
            :type
          />
          <span v-else>{{ value }}</span>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.liq-overview-table {
  --columns-data: 1fr auto;

  .collateral {
    display: flex;
    gap: 0.5ch;
  }

  .red {
    color: var(--c-red);
  }
}
</style>
