<script setup lang="ts">
import { DEFAULT_MIN_HEIGHT } from "@/Styles/ChartStylesLW";
import {
  useAprHistory,
  useCooldownQueue,
  useEvents,
  useQueryPositionHist,
  useTopUsers,
  useTvlHistory,
  useDistributionHistory,
} from "@HA/queries/insurance";
import ChartPositions from "./charts/ChartPositions.vue";
import ChartTvl from "./charts/ChartTvl.vue";
import TableCooldowns from "./tables/TableCooldowns.vue";
import TableEvents from "./tables/TableEvents.vue";
import TableTopUsers from "./tables/TableTopUsers.vue";

const { isFetching: loadingApr, data: aprData } = useAprHistory({
  chain: "ethereum",
});

const balancesApr = computed(() =>
  (aprData.value ?? [])
    .groupBy((x) => x.tokenAddress)
    .entries()
    .orderBy(([, data]) => data[0].tokenSymbol, "desc")
    .map(([, data]) => ({
      symbol: data[0].tokenSymbol,
      balances: data.map((x) => ({
        timestamp: x.timestamp,
        balance: x.apr,
        tokenPrice: 1,
      })),
    }))
);

const { isFetching: loadingTvl, data: tvlData } = useTvlHistory({
  chain: "ethereum",
});

const tvl = computed(() =>
  (tvlData.value ?? []).map((x) => ({
    timestamp: x.timestamp,
    tvl: x.tvl,
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

const { isFetching: loadingBins, data: bins } = useQueryPositionHist(
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
      symbol: "Active staked",
      balances: data.map((x) => ({
        timestamp: x.timestamp,
        balance: x.activeStakedAmount,
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
      title="Insurance"
      description="Insurance pool metrics for Resupply including APR, TVL and positions"
    />

    <ChartBalances
      v-if="!loadingApr"
      style="grid-area: apr"
      title="APR"
      :balances="balancesApr"
      :loading="loadingApr"
      :show-dollars="false"
    />
    <Card
      v-else
      loading
      title="APR"
      :style="`grid-area: apr; min-height: ${DEFAULT_MIN_HEIGHT}`"
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
