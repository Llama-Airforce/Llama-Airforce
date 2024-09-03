<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type SoftLiqRatio } from "@CM/Services/Liquidations";

type PriceOracle = {
  timestamp: number;
  priceOracle: number;
};

const { ratios, pricesOracle } = defineProps<{
  ratios: SoftLiqRatio[];
  pricesOracle: PriceOracle[];
}>();

// Legend
const { theme } = storeToRefs(useSettingsStore());

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
const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      leftPriceScale: {
        visible: true,
      },
    }),
  series: [
    {
      type: "Area",
      name: "price" as const,
      options: computed(
        (): AreaSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter: (x: number): string =>
              `$${round(x, 2, "dollar")}${unit(x, "dollar")}`,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          lineColor: theme.value.colors.yellow,
          topColor: "rgb(32, 129, 240, 0.2)",
          bottomColor: "rgba(32, 129, 240, 0)",
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
    {
      type: "Area",
      name: "ratio" as const,
      options: computed(
        (): AreaSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter: (x: number): string =>
              `${round(x, 0, "percentage")}${unit(x, "percentage")}`,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          lineColor: theme.value.colors.blue,
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
  if (!chart.value || !series.price || !series.ratio) {
    return;
  }

  const newProportionSerie: LineData[] = ratios
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.proportion,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const minTime =
    newProportionSerie.length > 0 ? (newProportionSerie[0].time as number) : 0;

  const newPriceSerie: LineData[] = pricesOracle
    .filter((x) => x.timestamp >= minTime)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.priceOracle,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newPriceSerie.length > 0) {
    series.price.setData(newPriceSerie);
  }

  if (newProportionSerie.length > 0) {
    series.ratio.setData(newProportionSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card title="Soft Liquidations Ratio">
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
