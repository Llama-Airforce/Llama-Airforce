<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { useSettingsStore } from "@CM/Stores";
import { useQuerySoftLiqRatios } from "@CM/Services/LlamaLend/Queries";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market, type SoftLiqRatio } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

// Refs
let softLiqSerie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    softLiqSerie = chart.addAreaSeries(createSoftLiqOptionsSerie());
  }
);

// Data
const { isFetching: loading, data: softLiqRatios } = useQuerySoftLiqRatios(
  toRef(() => market),
  toRef(() => chain)
);

// Watches
watch([softLiqRatios, chart], createSeries);
watch(theme, () => softLiqSerie?.applyOptions(createSoftLiqOptionsSerie()));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 200,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
}

function createSoftLiqOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
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

function createSeries([newSoftLiq, chart]: [
  SoftLiqRatio[]?,
  IChartApi?
]): void {
  if (!chart || !softLiqSerie) {
    return;
  }

  const newSoftLiqSerie: LineData[] = chain_(newSoftLiq)
    .groupBy((x) => x.timestamp)
    .mapValues((x) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: x[0].proportion,
    }))
    .entries()
    .map((x) => x[1])
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSoftLiqSerie.length > 0) {
    softLiqSerie.setData(newSoftLiqSerie);
  }

  chart.timeScale().fitContent();
}

// Methods
const formatter = (x: number): string =>
  `${round(x * 100, 2, "percentage")}${unit(x, "percentage")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Soft liquidation ratios
</i18n>
