<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['Liquidator Revenue', 'Discount']"
          :colors="theme.colorsArray"
        ></Legend>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type LiquidationDetails } from "@CM/Services/Liquidations";

type Discount = {
  timestamp: number;
  discount: number;
};

const { t } = useI18n();

// Props
interface Props {
  discounts: Discount[];
  liqs: LiquidationDetails[];
}

const { discounts, liqs } = defineProps<Props>();

// Refs
let discountSerie: ISeriesApi<"Area">;
let revenueSerie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    discountSerie = chart.addAreaSeries(createDiscountOptionsSerie());
    revenueSerie = chart.addAreaSeries(createRevenueOptionsSerie());
  }
);

// Watches
watch([toRef(() => discounts), toRef(() => liqs), chart], createSeries);
watch(theme, () => {
  discountSerie.applyOptions(createDiscountOptionsSerie());
  revenueSerie.applyOptions(createRevenueOptionsSerie());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    leftPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createRevenueOptionsSerie(): AreaSeriesPartialOptions {
  return {
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
  };
}

function createDiscountOptionsSerie(): AreaSeriesPartialOptions {
  return {
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
  };
}

function createSeries([newDiscount, newLiqs, chart]: [
  Discount[]?,
  LiquidationDetails[]?,
  IChartApi?
]): void {
  if (!chart || !discountSerie || !revenueSerie) {
    return;
  }

  const newRevenueSerie: LineData[] = chain(newLiqs)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.debt,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .reduce((acc, curr) => {
      const lastAccum = acc.length > 0 ? acc[acc.length - 1].value : 0;
      acc.push({ time: curr.time, value: curr.value + lastAccum });
      return acc;
    }, [] as LineData[])
    .value();

  const minTime = (newRevenueSerie[0]?.time as number) ?? 0;

  const newDiscountSerie: LineData[] = chain(newDiscount)
    .filter((x) => x.timestamp >= minTime)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.discount * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newRevenueSerie.length > 0) {
    revenueSerie.setData(newRevenueSerie);
  }

  if (newDiscountSerie.length > 0) {
    discountSerie.setData(newDiscountSerie);
  }

  chart.timeScale().fitContent();
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Liquidator Revenue
</i18n>
