<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import {
  type ISeriesApi,
  type LineData,
  type AreaSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
  type IChartApi,
} from "lightweight-charts";
import { Card, useQuery, useLightweightChart } from "@/Framework";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { type Chain } from "@CM/Models/Chain";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";
import type { Market, SoftLiqRatio } from "@CM/Pages/Platform/LlamaLend/Models";

const { t } = useI18n();

const llamaLendService = new LlamaLendService(getHost());

// Props
interface Props {
  market?: Market | null;
  chain?: Chain | null;
}

const { market = null, chain = null } = defineProps<Props>();

// Refs
let softLiqSerie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    softLiqSerie = chart.addAreaSeries(
      createSoftLiqOptionsSerie(storeSettings.theme)
    );
  }
);

// Data
const { isFetching: loading, data: softLiqRatios } = useQuery({
  queryKey: ["llama-market-softliqs", market?.controller] as const,
  queryFn: ({ queryKey: [, controller] }) => {
    if (controller && chain) {
      return llamaLendService.getSoftLiqRatios(chain, controller);
    } else {
      return Promise.resolve([]);
    }
  },
});

// Watches
watch([softLiqRatios, chart], createSeries);
watch(theme, (newTheme) => {
  if (softLiqSerie) {
    softLiqSerie.applyOptions(createSoftLiqOptionsSerie(newTheme));
  }
});
// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, {
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

function createSoftLiqOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: colors.blue,
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
