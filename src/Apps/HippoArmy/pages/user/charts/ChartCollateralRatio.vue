<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import type { Snapshot } from "@HA/services/user/schema";

const { snapshots, user, loading } = defineProps<{
  snapshots: Snapshot[];
  user?: string;
  loading: boolean;
}>();

// Chart
const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "collateralRatio" as const,
    color: computed(() => theme.value.colors.purple),
    formatter: "percent",
    precision: 1,
  }),
});

const hasData = computed(() => snapshots.length > 0);

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.collateralRatio || !hasData.value) {
    return;
  }

  const newCollateralRatioSerie = snapshots
    .map((x) => ({
      time: x.time.getUTCTimestamp(),
      value: Math.min(500, x.collateralRatio * 100),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.collateralRatio.setData(newCollateralRatioSerie);
  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Collateral Ratio"
    :loading
  >
    <template #actions>
      <div
        v-if="hasData"
        style="display: flex"
      >
        <BtnChartLWExport
          filename="collateral-ratio"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
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
