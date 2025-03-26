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
  <div class="protocol">
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
          :value="
            protocolData?.totalCollateral
              ? protocolData.totalCollateral / 10 ** 18
              : undefined
          "
          :precision="0"
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
      </KPI>
    </div>

    <TablePairs :protocol-name="protocolData?.name" />
  </div>
</template>

<style scoped>
.protocol {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.kpis {
  display: flex;
  gap: 1rem;

  > * {
    flex-grow: 1;
  }

  @media only screen and (max-width: 1280px) {
    flex-direction: column;
  }
}
</style>
