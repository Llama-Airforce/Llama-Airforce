<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Price = {
  timestamp: Date;
  price: number;
};

const { price } = defineProps<{
  price: Price[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "price" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `$${round(y, 4, "dollar")}${unit(y)}`,
    minMove: 0.001,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.price) {
    return;
  }

  const newSerie = price
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.price,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.price.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Stablecoin Price (reUSD)"
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
