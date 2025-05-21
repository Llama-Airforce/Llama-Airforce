<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Price = {
  timestamp: Date;
  price: number;
};

const { prices } = defineProps<{
  prices: Price[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "prices" as const,
    color: computed(() => theme.value.colors.purple),
    formatter: (y: number) => `$${round(y, 4, "dollar")}${unit(y)}`,
    minMove: 0.001,
    autoscaleInfoProvider: () => ({
      priceRange: {
        minValue: Math.max(Math.min(...prices.map((x) => x.price)), 0.8),
        maxValue: Math.min(Math.max(...prices.map((x) => x.price)), 1.2),
      },
    }),
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.prices) {
    return;
  }

  const newSerie = prices
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.price,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.prices.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Price"
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
