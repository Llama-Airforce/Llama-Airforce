<script setup lang="ts">
import { useQuerySupply } from "@CM/queries/dao";
import ChartSupply from "./Charts/ChartSupply.vue";
import ChartSupplyDelta from "./Charts/ChartSupplyDelta.vue";
import TableLockers from "./Tables/TableLockers.vue";
import TableLocks from "./Tables/TableLocks.vue";

const { isFetching: loadingSupply, data: supply } = useQuerySupply();

const supplyLatest = computed<(typeof supply.value)[number] | undefined>(
  () =>
    supply.value.orderBy((x) => x.timestamp.getTime(), "desc")[0] ?? undefined
);

const supplyVeCrv = computed(
  () => Number(supplyLatest.value?.veCrvTotal ?? 0) / 10 ** 18
);

const supplyCrv = computed(
  () => Number(supplyLatest.value?.crvSupply ?? 0) / 10 ** 18
);

const supplyCirc = computed(
  () => Number(supplyLatest.value?.circulatingSupply ?? 0) / 10 ** 18
);
</script>

<template>
  <div class="dashboard">
    <KPI
      style="grid-area: kpi1"
      label="veCRV Supply"
      :has-value="!loadingSupply"
    >
      <AsyncValue
        type="dollar"
        :value="supplyVeCrv"
        :precision="2"
        :show-symbol="false"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="CRV Supply / Circulating"
      :has-value="!loadingSupply"
    >
      <div class="two-sides">
        <div style="display: flex; gap: 0.5ch">
          <AsyncValue
            type="dollar"
            :value="supplyCrv"
            :precision="2"
            :show-symbol="false"
          />

          <span style="color: var(--c-lvl5)">/</span>

          <AsyncValue
            type="dollar"
            :value="supplyCirc"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <AsyncValue
          type="percentage"
          :value="(100 * supplyCirc) / supplyCrv"
          :precision="2"
        />
      </div>
    </KPI>

    <ChartSupply style="grid-area: supply" />
    <ChartSupplyDelta style="grid-area: supply-delta" />
    <TableLocks style="grid-area: locks" />
    <TableLockers style="grid-area: lockers" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 0.25fr 0.375fr 0.375fr;
  grid-template-rows: 5rem 500px 400px 400px;
  grid-template-areas:
    "locks kpi1 kpi2"
    "locks supply supply"
    "locks supply-delta supply-delta"
    "locks lockers lockers";

  .two-sides {
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    justify-content: space-between;

    .collateral {
      display: flex;
    }
  }
}
</style>
