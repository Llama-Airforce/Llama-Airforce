<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['% of loans in soft liquidation', 'Collateral price ($)']"
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
import { chain as chain_ } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type SoftLiqRatio } from "@CM/Services/Liquidations";

type PriceOracle = {
  timestamp: number;
  priceOracle: number;
};

const { t } = useI18n();

// Props
interface Props {
  ratios: SoftLiqRatio[];
  pricesOracle: PriceOracle[];
}

const { ratios, pricesOracle } = defineProps<Props>();

// Refs
let proportionSerie: ISeriesApi<"Area">;
let priceSerie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    proportionSerie = chart.addAreaSeries(createProportionOptionsSerie());
    priceSerie = chart.addAreaSeries(createPriceOptionsSerie());
  }
);

// Watches
watch([toRef(() => ratios), toRef(() => pricesOracle), chart], createSeries);
watch(theme, () => {
  proportionSerie.applyOptions(createProportionOptionsSerie());
  priceSerie.applyOptions(createPriceOptionsSerie());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
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

function createPriceOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 0,
      minMove: 1,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.yellow,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createProportionOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "percent",
      precision: 2,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.blue,
    priceScaleId: "left",
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSoftLiq, newSnapshots, chart]: [
  SoftLiqRatio[]?,
  PriceOracle[]?,
  IChartApi?
]): void {
  if (!chart || !proportionSerie) {
    return;
  }

  const newProportionSerie: LineData[] = chain_(newSoftLiq)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.proportion,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const minTime = (newProportionSerie[0]?.time as number) ?? 0;

  const newPriceSerie: LineData[] = chain_(newSnapshots)
    .filter((x) => x.timestamp >= minTime)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.priceOracle,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newPriceSerie.length > 0) {
    priceSerie.setData(newPriceSerie);
  }

  if (newProportionSerie.length > 0) {
    proportionSerie.setData(newProportionSerie);
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
    gap: 1rem;

    .chart {
      height: 200px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Soft Liquidations Ratio
</i18n>
