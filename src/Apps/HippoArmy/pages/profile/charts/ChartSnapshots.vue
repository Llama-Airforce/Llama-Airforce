<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import type { Snapshot } from "@HA/services/user/schema";

export type Serie = "collateral" | "debt";
const serie = ref<Serie>("collateral");

const { snapshots, user, loading } = defineProps<{
  snapshots: Snapshot[];
  user?: string;
  loading: boolean;
}>();

const hasData = computed(() => snapshots.length > 0);

// Chart
const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    createAreaSerie({
      name: "collateral" as const,
      color: computed(() => theme.value.colors.green),
      formatter: "volume",
    }),
    createAreaSerie({
      name: "debt" as const,
      color: computed(() => theme.value.colors.red),
      formatter: "volume",
    }),
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.collateral || !series.debt) {
    return;
  }

  const newCollateralSerie = snapshots
    .map((x) => ({
      time: x.time.getUTCTimestamp(),
      value: x.collateral / 10 ** 22,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDebtSerie = snapshots
    .map((x) => ({
      time: x.time.getUTCTimestamp(),
      value: x.debt,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.collateral.setData(newCollateralSerie);
  series.debt.setData(newDebtSerie);

  series.collateral.applyOptions({ visible: serie.value === "collateral" });
  series.debt.applyOptions({ visible: serie.value === "debt" });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="User Position History"
    :loading
  >
    <template #actions>
      <div
        v-if="hasData"
        style="display: flex"
      >
        <BtnChartLWExport
          filename="user-position"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <div
        v-if="hasData"
        class="button-group"
      >
        <ButtonToggle
          :model-value="serie === 'collateral'"
          @click="serie = 'collateral'"
        >
          Collateral
        </ButtonToggle>

        <ButtonToggle
          :model-value="serie === 'debt'"
          @click="serie = 'debt'"
        >
          Debt
        </ButtonToggle>
      </div>
    </template>

    <div
      v-if="hasData"
      ref="chartRef"
      class="chart"
    ></div>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has no snapshots`"
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 100%;
  min-height: 250px;
}
</style>
