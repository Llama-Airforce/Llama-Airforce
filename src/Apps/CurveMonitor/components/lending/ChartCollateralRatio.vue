<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/components";

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
  series: {
    type: "Area",
    name: "ratios" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) => `${round(x, 0, "percentage")}%`,
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
