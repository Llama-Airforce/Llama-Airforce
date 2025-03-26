<script setup lang="ts">
import { useDistributions } from "@HA/queries/revenue";

const chain = { chain: "ethereum" };
const { data } = useDistributions(chain);

const totalFees = computed(() => {
  if (!data.value?.distributions) return null;
  return data.value.distributions.reduce((sum, d) => sum + d.amount, 0);
});

const averageWeeklyFees = computed(() => {
  if (!data.value?.distributions || data.value.distributions.length === 0)
    return null;

  const lastYear = data.value.distributions.slice(0, 52);

  return lastYear.reduce((sum, d) => sum + d.amount, 0) / lastYear.length;
});

const stdDevWeeklyFees = computed(() => {
  if (!data.value?.distributions || data.value.distributions.length === 0)
    return null;

  const lastYear = data.value.distributions.slice(0, 52).map((d) => d.amount);

  const avg = lastYear.reduce((sum, val) => sum + val, 0) / lastYear.length;
  const squareDiffs = lastYear.map((val) => Math.pow(val - avg, 2));
  return Math.sqrt(
    squareDiffs.reduce((sum, val) => sum + val, 0) / (lastYear.length - 1)
  );
});
</script>

<template>
  <div class="kpis">
    <KPI
      label="Total"
      :has-value="!!totalFees"
    >
      <AsyncValue
        type="dollar"
        :value="totalFees"
        :precision="2"
        :show-symbol="false"
      />
      reUSD
    </KPI>

    <KPI
      label="Average (1y)"
      :has-value="!!averageWeeklyFees"
    >
      <AsyncValue
        type="dollar"
        :value="averageWeeklyFees"
        :precision="2"
        :show-symbol="false"
      />
      reUSD
    </KPI>

    <KPI
      label="Standard Deviation (1y)"
      :has-value="!!stdDevWeeklyFees"
    >
      <AsyncValue
        type="dollar"
        :value="stdDevWeeklyFees"
        :precision="2"
        :show-symbol="false"
      />
      reUSD
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--dashboard-gap);
}
</style>
