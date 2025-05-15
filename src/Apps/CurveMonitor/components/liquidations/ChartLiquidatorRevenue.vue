<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import type { LiquidationDetails } from "@curvefi/prices-api/liquidations";

type Discount = {
  timestamp: Date;
  discount: number;
};

const { discounts, liqs } = defineProps<{
  discounts: Discount[];
  liqs: LiquidationDetails[];
}>();

// Legend
const theme = useTheme();

const { items } = useLegend(() => [
  {
    id: "revenue",
    label: "Liquidator Revenue",
    color: theme.value.colorsArray[0],
  },
  {
    id: "discount",
    label: "Discount",
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
      name: "revenue" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: "price",
      precision: 0,
      minMove: 1,
    }),
    createAreaSerie({
      name: "discount" as const,
      color: computed(() => theme.value.colors.yellow),
      formatter: "percent",
      precision: 6,
      minMove: 0.000001,
    }),
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.discount || !series.revenue) {
    return;
  }

  const newRevenueSerie = liqs
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.debt,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .reduce<LineData[]>((acc, curr) => {
      const lastAccum = acc.length > 0 ? acc[acc.length - 1].value : 0;
      acc.push({ time: curr.time, value: curr.value + lastAccum });
      return acc;
    }, []);

  const minTime =
    newRevenueSerie.length > 0 ? (newRevenueSerie[0].time as number) : 0;

  const newDiscountSerie = discounts
    .filter((x) => x.timestamp.getUTCTimestamp() >= minTime)
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.discount * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.revenue.setData(newRevenueSerie);
  series.discount.setData(newDiscountSerie);

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card title="Liquidator Revenue">
    <template #actions-secondary>
      <Legend :items />
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
