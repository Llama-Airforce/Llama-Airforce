<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartOptions from "@CM/Util/ChartStyles";

type CollateralRatio = {
  timestamp: number;
  ratio: number;
};

const { ratios } = defineProps<{
  ratios: CollateralRatio[];
}>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Area",
    name: "ratios" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) =>
          `${round(x, 0, "percentage")}${unit(x, "percentage")}`,
        minMove: 0.1,
      },
      lineWidth: 2,
      lineType: LineType.WithSteps,
      lineColor: theme.value.colors.blue,
      topColor: "rgb(32, 129, 240, 0.2)",
      bottomColor: "rgba(32, 129, 240, 0)",
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.ratios) {
    return;
  }

  const newSerie: LineData[] = ratios
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
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
  <Card title="Collateral Ratio">
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
