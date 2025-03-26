<script setup lang="ts">
import { useSnapshots } from "@HA/queries/pairs";
import type { Pair } from "@HA/services/protocols/schema";
import ChartApr from "../charts/ChartApr.vue";
import ChartTvl from "../charts/ChartTvl.vue";

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
    tvl: x.totalCollateral / 10 ** 21,
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
    <KPI
      style="grid-area: kpi1"
      label="Positions"
      :has-value="!!pair"
    >
      <AsyncValue
        :precision="0"
        :value="pair?.activePositionsCount"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="TVL"
      :has-value="!!pair"
    >
      <AsyncValue
        type="dollar"
        :precision="2"
        :value="pair?.totalCollateral && pair.totalCollateral / 10 ** 21"
        :show-symbol="false"
      />
      {{ pair.tokenUnderlying.symbol }}
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Interest Rate"
      :has-value="!!pair"
    >
      <AsyncValue
        type="percentage"
        :precision="2"
        :value="pair?.interestRate && pair.interestRate / 10 ** 8"
      />
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="Utilization Rate"
      :has-value="!!pair"
    >
      <AsyncValue
        type="percentage"
        :precision="2"
        :value="pair?.utilizationRate"
      />
    </KPI>

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

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "tvl tvl apr apr";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "kpi1 kpi2"
      "kpi3 kpi4"
      "tvl tvl"
      "apr apr";
  }
}
</style>
