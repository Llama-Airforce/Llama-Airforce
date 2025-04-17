<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type CollateralRatio = {
  timestamp: Date;
  ratio: number;
};

const { ratios } = defineProps<{
  ratios: CollateralRatio[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "ratios" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (x: number) => `${round(x, 0, "percentage")}%`,
    minMove: 0.01,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.ratios) {
    return;
  }

  const newSerie = ratios
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.ratio * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.ratios.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Collateral Ratio"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="collateral_ratio"
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
