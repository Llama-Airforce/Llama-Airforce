<script setup lang="ts">
import { DEFAULT_MIN_HEIGHT } from "@/Styles/ChartStylesLW";
import {
  useAprHistory,
  useCooldownQueue,
  useDistributionHistory,
  useEvents,
  usePositionHist,
  useTopUsers,
  useTvlHistory,
} from "@HA/queries/staking";
import ChartApr from "./charts/ChartApr.vue";
import ChartPositions from "./charts/ChartPositions.vue";
import ChartTvl from "./charts/ChartTvl.vue";
import TableCooldowns from "./tables/TableCooldowns.vue";
import TableEvents from "./tables/TableEvents.vue";
import TableTopUsers from "./tables/TableTopUsers.vue";

const { isFetching: loadingApr, data: aprData } = useAprHistory({
  chain: "ethereum",
});

const apr = computed(() =>
  (aprData.value ?? []).map((x) => ({
    timestamp: x.timestamp,
    apr: x.apr,
  }))
);

const { isFetching: loadingTvl, data: tvlData } = useTvlHistory({
  chain: "ethereum",
});

const tvl = computed(() =>
  (tvlData.value ?? []).map((x) => ({
    timestamp: x.timestamp,
    tvl: x.tvl,
    tvlUsd: x.tvlUsd,
  }))
);

const pageEvents = ref(1);
const { isFetching: loadingEvents, data: events } = useEvents(
  computed(() => ({
    chain: "ethereum",
    page: pageEvents.value,
    per_page: 10,
  }))
);

const { isFetching: loadingTopUsers, data: topUsers } = useTopUsers(
  toRef(() => ({
    chain: "ethereum",
  }))
);

const { isFetching: loadingCooldowns, data: cooldownQueue } = useCooldownQueue(
  toRef(() => ({
    chain: "ethereum",
  }))
);

const { isFetching: loadingBins, data: bins } = usePositionHist(
  toRef(() => ({
    chain: "ethereum",
  }))
);

const { isFetching: loadingHistory, data: history } = useDistributionHistory(
  toRef(() => ({
    chain: "ethereum",
  }))
);

const balancesStaked = computed(() => {
  const data = history.value?.data ?? [];
  if (data.length === 0) return [];

  return [
    {
      symbol: "In cooldown",
      balances: data.map((x) => ({
        timestamp: x.timestamp,
        balance: x.cooldownAmount,
        tokenPrice: 1,
      })),
    },
    {
      symbol: "Regular staked",
      balances: data.map((x) => ({
        timestamp: x.timestamp,
        balance: x.regularStakedAmount - x.cooldownAmount,
        tokenPrice: 1,
      })),
    },
    {
      symbol: "Perma staked",
      balances: data.map((x) => ({
        timestamp: x.timestamp,
        balance: x.permaStakedAmount,
        tokenPrice: 1,
      })),
    },
  ];
});
</script>

<template>
  <div class="dashboard">
    <DashboardHeader
      style="grid-area: header"
      title="Staking"
      description="User governance staking metrics (RSUP)"
    />

    <ChartApr
      style="grid-area: apr"
      :apr
      :loading="loadingApr"
    />

    <ChartTvl
      style="grid-area: tvl"
      :tvl
      :loading="loadingTvl"
    />

    <TableEvents
      style="grid-area: events"
      :events="events?.events ?? []"
      :count="events?.count ?? 0"
      :loading="loadingEvents"
      @page="pageEvents = $event"
    />

    <TableCooldowns
      style="grid-area: cooldowns"
      :cooldowns="cooldownQueue?.entries ?? []"
      :loading="loadingCooldowns"
    />

    <ChartBalances
      v-if="!loadingHistory"
      style="grid-area: chart-staked"
      title="Staked"
      :balances="balancesStaked"
      :show-dollars="false"
    />
    <Card
      v-else
      loading
      title="Staked"
      :style="`grid-area: chart-staked; min-height: ${DEFAULT_MIN_HEIGHT}`"
    />

    <TableTopUsers
      style="grid-area: top-users"
      :top-users="topUsers?.users ?? []"
      :loading="loadingTopUsers"
    />

    <ChartPositions
      style="grid-area: positions"
      :bins="bins?.bins ?? []"
      :loading="loadingBins"
    />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns:
    minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)
    minmax(0, 1fr) minmax(0, 1fr);

  grid-template-areas:
    "header header header header header header"
    "apr apr apr tvl tvl tvl"
    "chart-staked chart-staked chart-staked chart-staked chart-staked chart-staked"
    "events events events cooldowns cooldowns cooldowns"
    "top-users top-users positions positions positions positions";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
