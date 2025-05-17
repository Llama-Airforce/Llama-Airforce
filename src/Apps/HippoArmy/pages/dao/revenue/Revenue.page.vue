<script setup lang="ts">
import { DEFAULT_MIN_HEIGHT } from "@/Styles/ChartStylesLW";
import { useDistributions } from "@HA/queries/revenue";
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

const ALL = "All" as const;
const protocols = computed(() => [
  ALL,
  ...(data.value?.distributions ?? [])
    .flatMap((x) => x.breakdown.map((y) => y.protocolName))
    .uniq(),
]);
const protocolSelected = ref<string>(ALL);

type Breakdown = NonNullable<
  typeof data.value
>["distributions"][number]["breakdown"][number];

const protocolFilter = (x: Breakdown) =>
  protocolSelected.value === ALL || x.protocolName === protocolSelected.value;

const balancesBreakdown = computed(() => {
  const xs = (data.value?.distributions ?? []).map((x) => ({
    timestamp: x.blockTime,
    fees: x.breakdown.filter(protocolFilter).sumBy((x) => x.fees),
    interest: x.breakdown.filter(protocolFilter).sumBy((x) => x.interest),
  }));

  if (xs.length === 0) return [];

  return [
    {
      symbol: "Fees",
      balances: xs.map((x) => ({
        timestamp: x.timestamp,
        balance: x.fees,
        tokenPrice: 1,
      })),
    },
    {
      symbol: "Interest",
      balances: xs.map((x) => ({
        timestamp: x.timestamp,
        balance: x.interest,
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
      title="Revenue"
      description="Token revenue distribution metrics"
    />

    <KPIs style="grid-area: kpis" />

    <ChartBalances
      v-if="!loading"
      style="grid-area: chart"
      title="Breakdown"
      chart-type="bars"
      :balances="balancesBreakdown"
      :show-dollars="false"
    >
      <template #actions>
        <Select
          v-if="protocols.length > 0"
          :options="protocols"
          :selected="
            protocols.find((x) => x === protocolSelected) ?? protocols[0]
          "
          @select="protocolSelected = $event"
        >
          <template #option="{ option }">
            {{ option }}
          </template>
        </Select>
      </template>
    </ChartBalances>
    <Card
      v-else
      loading
      title="Breakdown"
      :style="`grid-area: chart; min-height: ${DEFAULT_MIN_HEIGHT}`"
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

.select {
  z-index: 2;
  width: 10rem;
}
</style>
