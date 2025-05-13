<script setup lang="ts">
import { useSnapshots } from "@HA/queries/pairs";
import type { Pair } from "@HA/services/protocols/schema";
import ChartApr from "../charts/ChartApr.vue";
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

const apr = computed(() =>
  (snapshots.value ?? []).map((x) => ({
    timestamp: x.time,
    apr: x.aprBase,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <OverviewKPIs
      style="grid-area: kpis"
      :pair
    />

    <ChartTvl
      style="grid-area: tvl"
      :tvl
      :loading
    />

    <ChartApr
      style="grid-area: apr"
      :apr
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
    "tvl apr";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
