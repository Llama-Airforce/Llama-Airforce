<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";

type Volume = {
  timestamp: Date;
  volume: number;
};

const { volume } = defineProps<{
  volume: Volume[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Area",
    name: "volume" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
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
  if (!chart.value || !series.volume) {
    return;
  }

  const newSerie = volume
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.volume,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.volume.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Volume"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="volume"
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
