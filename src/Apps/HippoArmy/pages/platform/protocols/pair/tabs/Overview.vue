<script setup lang="ts">
import { DEFAULT_MIN_HEIGHT } from "@/Styles/ChartStylesLW";
import { useSnapshots } from "@HA/queries/pairs";
import type { Pair } from "@HA/services/protocols/schema";
import ChartBorrowCostApr from "../charts/ChartBorrowCostApr.vue";
import ChartTvl from "../charts/ChartTvl.vue";
import OverviewKPIs from "../components/OverviewKPIs.vue";

const { pair } = defineProps<{
  pair: Pair;
}>();

const { isFetching: loading, data: snapshots } = useSnapshots(
  toRef(() => ({
    pair_id: pair.pairId,
  }))
);

const tvl = computed(() =>
  (snapshots.value ?? []).map((x) => ({
    timestamp: x.time,
    tvl: x.totalUnderlying,
  }))
);

const borrowCostApr = computed(() =>
  (snapshots.value ?? []).map((x) => ({
    timestamp: x.time,
    apr: x.aprBorrowCost,
  }))
);

const balancesApr = computed(() => {
  const data = (snapshots.value ?? []).filter((x) => x.rewards.length > 0);

  const baseApr = data.map((x) => ({
    timestamp: x.time,
    apr: x.aprBase,
    tokenAddress: "0x0" as Address,
    tokenSymbol: "Base APR",
  }));

  const rewards = data.flatMap((x) =>
    x.rewards.map((y) => ({ ...y, timestamp: x.time }))
  );

  return baseApr
    .concat(rewards)
    .groupBy((x) => x.tokenAddress)
    .entries()
    .filter(
      ([, data]) =>
        data.length > 0 && data.sumBy((x) => x.apr) / data.length >= 1
    )
    .map(([, data]) => ({
      symbol: data[0].tokenSymbol,
      balances: data.map((x) => ({
        timestamp: x.timestamp,
        balance: x.apr,
        tokenPrice: 1,
      })),
    }));
});
</script>

<template>
  <div class="dashboard-grid">
    <OverviewKPIs
      style="grid-area: kpis"
      :pair
    />

    <ChartBalances
      v-if="!loading"
      style="grid-area: apr"
      title="APR"
      :balances="balancesApr"
      :show-dollars="false"
    />
    <Card
      v-else
      loading
      title="APR"
      :style="`grid-area: apr; min-height: ${DEFAULT_MIN_HEIGHT}`"
    />

    <ChartBorrowCostApr
      style="grid-area: borrow-cost-apr"
      :apr="borrowCostApr"
      :loading
    />

    <ChartTvl
      style="grid-area: tvl"
      :tvl
      :loading
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "kpis kpis"
    "apr tvl"
    "borrow-cost-apr .";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
