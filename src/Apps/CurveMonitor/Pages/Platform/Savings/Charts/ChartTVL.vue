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
    name: "tvl" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.tvl) {
    return;
  }

  const newSeries = data.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.assets,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  // Lend APY serie
  if (newSeries.length > 0) {
    series.tvl.setData(newSeries);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="TVL"
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
