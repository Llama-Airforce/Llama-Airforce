<script setup lang="ts">
import type { LiqOverview } from "@curvefi/prices-api/liquidations";

const { overview } = defineProps<{
  overview: LiqOverview | undefined;
}>();

const badDebt = computed((): number => {
  if (!overview) {
    return 0;
  }

  const debt = overview.liqableDebtUsd;
  const collateral = overview.liqableCollatUsd + overview.liqableBorrowedUsd;
  const value = debt - collateral;

  return value <= 0 ? 0 : value;
});
</script>

<template>
  <Card title="General Health Metrics">
    <Table class="liq-overview-table">
      <TableRow>
        <div>Users in soft liquidation</div>
        <div class="end">{{ overview?.softLiqUsers ?? 0 }}</div>
      </TableRow>

      <TableRow>
        <div>Median health</div>
        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="overview?.medianHealth ?? 0"
          />
        </div>
      </TableRow>

      <TableRow>
        <div>Collaterization ratio</div>
        <div class="end">
          <AsyncValue
            show-zero
            type="percentage"
            :value="overview?.collatRatio ?? 0"
          />
        </div>
      </TableRow>

      <TableRow>
        <div>Liquidatable positions</div>
        <div class="end">{{ overview?.liqablePositions ?? 0 }}</div>
      </TableRow>

      <TableRow>
        <div>Liquidatable positions' debt</div>
        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="overview?.liqableDebtUsd ?? 0"
          />
        </div>
      </TableRow>

      <TableRow>
        <div>Liquidatable collateral (token / crvUSD)</div>
        <div class="collateral end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="overview?.liqableCollatUsd ?? 0"
          />

          /

          <AsyncValue
            show-zero
            type="dollar"
            :value="overview?.liqableBorrowedUsd ?? 0"
          />
        </div>
      </TableRow>

      <TableRow v-if="badDebt > 0">
        <div>Bad debt</div>
        <div class="end">
          <AsyncValue
            show-zero
            class="red"
            type="dollar"
            :value="badDebt"
          />
        </div>
      </TableRow>
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
