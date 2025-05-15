<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import type { SoftLiqRatio } from "@curvefi/prices-api/liquidations";

type PriceOracle = {
  timestamp: Date;
  priceOracle: number;
};

const { ratios, pricesOracle } = defineProps<{
  ratios: SoftLiqRatio[];
  pricesOracle: PriceOracle[];
}>();

// Legend
const theme = useTheme();

const { items } = useLegend(() => [
  {
    id: "percentage",
    label: "% of loans in soft liquidation",
    color: theme.value.colorsArray[0],
  },
  {
    id: "collateral-price",
    label: "Collateral price ($)",
    color: theme.value.colorsArray[1],
  },
]);

// Chart
const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    leftPriceScale: {
      visible: true,
    },
  }),
  series: [
    createAreaSerie({
      name: "price" as const,
      color: computed(() => theme.value.colors.yellow),
      formatter: (x: number) => `$${round(x, 2, "dollar")}${unit(x)}`,
    }),
    createAreaSerie({
      name: "ratio" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: (x: number): string => `${round(x, 0, "percentage")}%`,
    }),
  ] as const,
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.price || !series.ratio) {
    return;
  }

  const newProportionSerie = ratios
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.proportion,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const minTime =
    newProportionSerie.length > 0 ? newProportionSerie[0].time : 0;

  const newPriceSerie = pricesOracle
    .filter((x) => x.timestamp.getUTCTimestamp() >= minTime)
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.priceOracle,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.price.setData(newPriceSerie);
  series.ratio.setData(newProportionSerie);

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card title="Soft Liquidations Ratio">
    <template #actions-secondary>
      <Legend :items />
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
