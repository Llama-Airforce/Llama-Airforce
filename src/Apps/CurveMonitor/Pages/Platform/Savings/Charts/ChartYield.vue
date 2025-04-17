<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQueryYield } from "@CM/queries/savings";

// Data
const { isFetching: loading, data } = useQueryYield();

// Chart
const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "apy" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `${round(y, 0, "percentage")}%`,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.apy) {
    return;
  }

  const newSeries = data.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.apyProjected,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  // Lend APY serie
  if (newSeries.length > 0) {
    series.apy.setData(newSeries);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Yield"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="rates"
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
