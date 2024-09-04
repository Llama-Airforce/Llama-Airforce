<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type LiquidationDetails } from "@CM/Services/Liquidations";

type Discount = {
  timestamp: number;
  discount: number;
};

const { discounts, liqs } = defineProps<{
  discounts: Discount[];
  liqs: LiquidationDetails[];
}>();

// Legend
const { theme } = storeToRefs(useSettingsStore());

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
  createChartOptions: (chartRef) =>
    computed(() =>
      createChartStyles(chartRef, theme.value, {
        leftPriceScale: {
          visible: true,
        },
      })
    ),
  series: [
    {
      type: "Area",
      name: "revenue" as const,
      options: computed(
        (): AreaSeriesPartialOptions => ({
          priceFormat: {
            type: "price",
            precision: 0,
            minMove: 1,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          lineColor: theme.value.colors.blue,
          topColor: "rgb(32, 129, 240, 0.2)",
          bottomColor: "rgba(32, 129, 240, 0)",
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
    {
      type: "Area",
      name: "discount" as const,
      options: computed(
        (): AreaSeriesPartialOptions => ({
          priceFormat: {
            type: "percent",
            precision: 6,
            minMove: 0.000001,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          lineColor: theme.value.colors.yellow,
          priceScaleId: "left",
          topColor: "rgb(32, 129, 240, 0.2)",
          bottomColor: "rgba(32, 129, 240, 0)",
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.discount || !series.revenue) {
    return;
  }

  const newRevenueSerie: LineData[] = liqs
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
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

  const newDiscountSerie: LineData[] = discounts
    .filter((x) => x.timestamp >= minTime)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.discount * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newRevenueSerie.length > 0) {
    series.revenue.setData(newRevenueSerie);
  }

  if (newDiscountSerie.length > 0) {
    series.discount.setData(newDiscountSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card title="Liquidator Revenue">
    <template #actions>
      <div class="actions">
        <Legend :items></Legend>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
