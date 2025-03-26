<script setup lang="ts">
import {
  useAprHistory,
  useCooldownQueue,
  useEvents,
  useQueryPositionHist,
  useTopUsers,
  useTvlHistory,
} from "@HA/queries/insurance";
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

const { isFetching: loadingCooldowns, data: cooldowns } = useCooldownQueue(
  toRef(() => ({
    chain: "ethereum",
  }))
);

const { isFetching: loadingBins, data: bins } = useQueryPositionHist(
  toRef(() => ({
    chain: "ethereum",
  }))
);
</script>

<template>
  <div class="dashboard">
    <DashboardHeader
      style="grid-area: header"
      title="Insurance"
      description="Insurance pool metrics for Resupply including APR, TVL and positions"
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

    <TableTopUsers
      style="grid-area: top-users"
      :top-users="topUsers?.users ?? []"
      :loading="loadingTopUsers"
    />

    <TableCooldowns
      style="grid-area: cooldowns"
      :cooldowns="cooldowns?.entries ?? []"
      :loading="loadingCooldowns"
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
    "events events events cooldowns cooldowns cooldowns"
    "top-users top-users positions positions positions positions";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
