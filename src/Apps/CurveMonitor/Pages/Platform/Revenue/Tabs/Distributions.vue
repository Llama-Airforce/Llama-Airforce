<script setup lang="ts">
import TableDistributions from "@CM/Pages/Platform/Revenue/Tables/TableDistributions.vue";
import ChartDistributions from "@CM/Pages/Platform/Revenue/Charts/ChartDistributions.vue";
import ChartDistributionsDelta from "@CM/Pages/Platform/Revenue/Charts/ChartDistributionsDelta.vue";
import { useQueryDistributions } from "@CM/Services/Revenue/Queries";

const { isFetching: loading, data: distributions } = useQueryDistributions();

// KPIs
const totalFees = computed(() => distributions.value.sumBy((x) => x.feesUsd));

const averageWeeklyFees = computed(() =>
  distributions.value
    .orderBy((x) => x.timestamp, "desc")
    .take(52)
    .meanBy((x) => x.feesUsd)
);

const stdDevWeeklyFees = computed(() => {
  const lastYear = distributions.value
    .orderBy((x) => x.timestamp, "desc")
    .take(52)
    .map((x) => x.feesUsd);

  const avg = lastYear.meanBy((x) => x);
  const squareDiffs = lastYear.map((value) => Math.pow(value - avg, 2));
  return Math.sqrt(squareDiffs.sumBy((x) => x) / (lastYear.length - 1));
});
</script>

<template>
  <div class="distributions">
    <KPI
      style="grid-area: kpi1"
      label="Total"
      :has-value="distributions.length > 0"
    >
      <AsyncValue
        :value="totalFees"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Average (1y)"
      :has-value="distributions.length > 0"
    >
      <AsyncValue
        :value="averageWeeklyFees"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Standard Deviation (1y)"
      :has-value="distributions.length > 0"
    >
      <AsyncValue
        :value="stdDevWeeklyFees"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <ChartDistributions
      style="grid-area: chart"
      :distributions
      :loading
    ></ChartDistributions>

    <ChartDistributionsDelta
      style="grid-area: delta"
      :distributions
      :loading
    ></ChartDistributionsDelta>

    <TableDistributions
      style="grid-area: table"
      :distributions
      :loading
    ></TableDistributions>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.distributions {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-columns: 0.3fr 0.33fr 0.33fr 0.33fr;
  grid-template-rows: 5rem 400px 400px;
  grid-template-areas:
    "table kpi1 kpi2 kpi3"
    "table chart chart chart"
    "table delta delta delta";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 400px 400px 400px;
    grid-template-areas:
      "kpi1 kpi2 kpi3"
      "chart chart chart"
      "delta delta delta"
      "table table table";
  }
}
</style>
