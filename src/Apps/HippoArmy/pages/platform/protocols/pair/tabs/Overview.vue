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
    <div
      class="kpis"
      style="grid-area: kpis"
    >
      <KPI
        label="Positions"
        :has-value="!!pair"
      >
        <AsyncValue
          :precision="0"
          :value="pair?.activePositionsCount"
        />
      </KPI>

      <KPI
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
        label="Utilization Rate"
        :has-value="!!pair"
      >
        <AsyncValue
          type="percentage"
          :precision="2"
          :value="pair?.utilizationRate"
        />
      </KPI>
    </div>

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

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--dashboard-gap);
}
</style>
