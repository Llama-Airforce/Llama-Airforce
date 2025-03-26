<script setup lang="ts">
import { useDistributions } from "@HA/queries/revenue";
import ChartDistributions from "./charts/ChartDistributions.vue";
import ChartDistributionsDelta from "./charts/ChartDistributionsDelta.vue";
import KPIs from "./components/KPIs.vue";
import TableDistributions from "./tables/TableDistributions.vue";

const page = ref(1);
const { isFetching: loading, data } = useDistributions(
  computed(() => ({
    chain: "ethereum",
    page: page.value,
    per_page: 15,
  }))
);
</script>

<template>
  <div class="dashboard">
    <DashboardHeader
      style="grid-area: header"
      title="Revenue"
      description="Token revenue distribution metrics"
    />

    <KPIs style="grid-area: kpis" />

    <ChartDistributions
      style="grid-area: chart"
      :distributions="data?.distributions ?? []"
    />

    <ChartDistributionsDelta
      style="grid-area: delta"
      :distributions="data?.distributions ?? []"
    />

    <TableDistributions
      style="grid-area: table"
      :distributions="data?.distributions ?? []"
      :count="data?.count ?? 0"
      :loading
      @page="page = $event"
    />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "header header header"
    "kpis kpis kpis"
    "table chart chart"
    "table delta delta";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
