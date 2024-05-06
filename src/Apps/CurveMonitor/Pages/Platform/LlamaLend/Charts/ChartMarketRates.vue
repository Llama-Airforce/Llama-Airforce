<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['Borrow APY', 'Lend APY']"
          :colors="colorsLegend"
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
import {
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type LineSeriesPartialOptions,
  type UTCTimestamp,
} from "lightweight-charts";
import { useQuery } from "@tanstack/vue-query";
import { round, unit } from "@/Util";
import { getHost } from "@/Services/Host";
import { getColors } from "@/Styles/Themes/CM";
import { type Chain } from "@CM/Models/Chain";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import type { Theme } from "@CM/Models/Theme";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";
import type { Market, Snapshot } from "@CM/Pages/Platform/LlamaLend/Models";

const { t } = useI18n();

const llamaLendService = new LlamaLendService(getHost());

// Props
interface Props {
  market?: Market | null;
  chain?: Chain | null;
}

const { market = null, chain = null } = defineProps<Props>();

// Refs
let borrowApySerie: ISeriesApi<"Line">;
let lendApySerie: ISeriesApi<"Line">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    borrowApySerie = chart.addLineSeries(
      createOptionsSerieBorrowApy(storeSettings.theme)
    );
    lendApySerie = chart.addLineSeries(
      createOptionsLendApy(storeSettings.theme)
    );
  }
);

const colorsLegend = computed(() => {
  const colors = getColors(storeSettings.theme);

  return [colors.red, colors.green];
});

// Data
const { isFetching: loading, data: snapshots } = useQuery({
  queryKey: ["llama-market-snapshots", market?.controller] as const,
  queryFn: ({ queryKey: [, controller] }) => {
    if (controller && chain) {
      return llamaLendService.getSnapshots(chain, controller);
    } else {
      return Promise.resolve([]);
    }
  },
});

// Watches
watch([snapshots, chart], createSeries);
watch(theme, (newTheme) => {
  borrowApySerie.applyOptions(createOptionsSerieBorrowApy(newTheme));
  lendApySerie.applyOptions(createOptionsLendApy(newTheme));
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
      priceFormatter: (apy: number) => formatterApy(apy),
    },
  });
}

function createOptionsSerieBorrowApy(theme: Theme): LineSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.01,
    },
    lineWidth: 2,
    color: colors.red,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createOptionsLendApy(theme: Theme): LineSeriesPartialOptions {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.01,
    },
    lineWidth: 2,
    color: colors.green,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSnapshots, chart]: [Snapshot[]?, IChartApi?]): void {
  if (!chart || !borrowApySerie || !lendApySerie) {
    return;
  }

  const newBorrowApySerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.borrowApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newLendApySerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.lendApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  // Borrow APY serie
  if (newBorrowApySerie.length > 0) {
    borrowApySerie.setData(newBorrowApySerie);
  }

  // Lend APY serie
  if (newLendApySerie.length > 0) {
    lendApySerie.setData(newLendApySerie);
  }

  if (newBorrowApySerie.length > 0 || newLendApySerie.length > 0) {
    const from = Math.min(
      (newBorrowApySerie[0]?.time as UTCTimestamp) ?? Infinity,
      (newLendApySerie[0]?.time as UTCTimestamp) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newBorrowApySerie[newBorrowApySerie.length - 1]?.time as UTCTimestamp) ??
        -Infinity,
      (newLendApySerie[newLendApySerie.length - 1]?.time as UTCTimestamp) ??
        -Infinity
    ) as UTCTimestamp;

    chart.timeScale().setVisibleRange({ from, to });
  }
}

const formatterApy = (x: number): string =>
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
title: Market rates
</i18n>
