<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Tvl = {
  timestamp: Date;
  tvl: number;
};

const { tvl } = defineProps<{
  tvl: Tvl[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "tvl" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `${round(y, 1, "dollar")}${unit(y)}`,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.tvl) {
    return;
  }

  const newSerie = tvl
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.tvl,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.tvl.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="TVL (reUSD)"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="tvl"
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
