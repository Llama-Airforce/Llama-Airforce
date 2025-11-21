<script setup lang="ts">
import ChartAPR from "./charts/ChartAPR.vue";
import ChartTVL from "./charts/ChartTVL.vue";
import ChartVolume from "./charts/ChartVolume.vue";
import TableEvents from "./tables/TableEvents.vue";
import TableTopUsers from "./tables/TableTopUsers.vue";
import { useTopUsers } from "@HA/queries/savings";
import { useStats } from "@HA/queries/savings";

const { isFetching: loadingTopUsers, data: topUsers } = useTopUsers(toRef(() => ({ chain: "ethereum" })));
const { data: stats } = useStats(toRef(() => ({ chain: "ethereum" })));
</script>

<template>
  <div class="dashboard">
    <DashboardHeader style="grid-area: header" title="Savings" description="scrvUSD savings metrics including APR, TVL, events and volume" />

    <KPI style="grid-area: kpi1" label="APY (Current)" :has-value="stats?.currentApr !== undefined">
      <AsyncValue type="percentage" :value="stats?.currentApr ?? null" />
    </KPI>

    <KPI style="grid-area: kpi2" label="TVL (USD)" :has-value="!!stats">
      <AsyncValue type="dollar" :value="stats?.tvlUsd" :precision="0" />
    </KPI>

    <ChartAPR style="grid-area: apr" />
    <ChartTVL style="grid-area: tvl" />

    <ChartVolume style="grid-area: volume" />

    <TableEvents style="grid-area: events" />

    <TableTopUsers style="grid-area: top-users" :top-users="topUsers?.users ?? []" :loading="loadingTopUsers" />

  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "header header header header header header"
    "kpi1 kpi1 kpi1 kpi2 kpi2 kpi2"
    "apr apr apr tvl tvl tvl"
    "volume volume volume volume volume volume"
    "events events events top-users top-users top-users"
    ;
  @media only screen and (max-width: 1280px) { display: flex; flex-direction: column; }
}
</style>
