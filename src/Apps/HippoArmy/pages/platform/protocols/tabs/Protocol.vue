<script setup lang="ts">
import { useOverview, useHistory } from "@HA/queries/protocols";
import ChartTvl from "../charts/ChartTvl.vue";
import TablePairs from "../tables/TablePairs.vue";

const { protocol } = defineProps<{
  protocol: "curvelend" | "fraxlend";
}>();

const { isFetching: loading, data: protocols } = useOverview({
  chain: "ethereum",
});

const protocolData = computed(() =>
  (protocols.value?.protocols ?? []).find(
    (x) => x.name.toLocaleLowerCase() === protocol
  )
);

const { isFetching: loadingHistory, data: history } = useHistory({
  chain: "ethereum",
});

const historyGrouped = computed(() =>
  (history.value?.snapshots ?? [])
    .filter((x) => x.name.toLocaleLowerCase() === protocol)
    .groupBy((x) => x.timestamp.getTime())
    .entries()
);

const tvl = computed(() =>
  historyGrouped.value.flatMap(([, items]) => ({
    timestamp: items[0].timestamp,
    underlying: items.sumBy((x) => x.totalUnderlying),
    debt: items.sumBy((x) => x.totalDebt),
  }))
);
</script>

<template>
  <div class="dashboard-grid root">
    <div class="kpis">
      <KPI
        label="Pairs"
        :has-value="!loading"
      >
        <AsyncValue
          :value="protocolData?.pairsCount"
          :precision="0"
        />
      </KPI>

      <KPI
        label="Total collateral"
        :has-value="!loading"
      >
        <AsyncValue
          type="dollar"
          :value="
            protocolData?.totalUnderlying
              ? protocolData.totalUnderlying
              : undefined
          "
          :precision="2"
        />
      </KPI>

      <KPI
        label="Total debt"
        :has-value="!loading"
      >
        <AsyncValue
          :value="protocolData?.totalDebt"
          :precision="0"
        />
        reUSD
      </KPI>
    </div>

    <TablePairs :protocol-name="protocolData?.name" />

    <div class="dashboard-grid charts">
      <ChartTvl
        style="grid-area: chart-tvl"
        :tvl
        :loading="loadingHistory"
      />
    </div>
  </div>
</template>

<style scoped>
.root {
  margin: var(--dashboard-gap) 0;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--dashboard-gap);
}

.charts {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "chart-tvl";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
