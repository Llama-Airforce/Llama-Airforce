<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useAprHistory } from "@HA/queries/savings";

const { isFetching: loading, data } = useAprHistory(
  toRef(() => ({ chain: "ethereum" }))
);

const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "apr" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `${round(y, 0, "percentage")}%`,
    minMove: 0.01,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.apr) return;

  const newSerie = (data.value ?? [])
    .map((x) => ({ time: x.timestamp.getUTCTimestamp(), value: x.apr }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) series.apr.setData(newSerie);

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="APR"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="apr"
          :series
        />
        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
