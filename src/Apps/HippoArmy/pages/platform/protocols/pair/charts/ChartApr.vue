<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";

type Apr = {
  timestamp: Date;
  apr: number;
};

const { apr } = defineProps<{
  apr: Apr[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Line",
    name: "apr" as const,
    options: computed<LineSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
        minMove: 0.01,
      },
      lineWidth: 2,
      color: theme.value.colors.blue,
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.apr) {
    return;
  }

  const newSerie = apr
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.apr,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.apr.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="APR"
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
