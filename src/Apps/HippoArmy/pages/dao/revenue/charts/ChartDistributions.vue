<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { Distribution } from "@HA/services/revenue/schema";

const { distributions } = defineProps<{
  distributions: Distribution[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: HistogramSeries,
    name: "distributions" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) => `$${round(x, 0, "dollar")}${unit(x)}`,
        minMove: 0.01,
      },
      color: theme.value.colors.blue,
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.distributions) {
    return;
  }

  series.distributions.setData(
    distributions
      .map((x) => ({
        time: x.blockTime.getUTCTimestamp(),
        value: x.amount,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
      .takeRight(52)
  );

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Distributions (1y)"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="distributions"
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
