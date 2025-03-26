<script setup lang="ts">
import { useOverview } from "@HA/queries/protocols";
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
</script>

<template>
  <div class="dashboard-grid">
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
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--dashboard-gap);
}
</style>
