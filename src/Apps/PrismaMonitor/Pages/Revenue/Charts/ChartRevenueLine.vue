<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { chain } from "lodash";
import {
  type ISeriesApi,
  type LineData,
  type AreaSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { useLightweightChart } from "@/Framework";
import { round, unit } from "@/Util";
import { getLineChartColors } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { type SnapshotRevenue } from "@PM/Services";

// Props
interface Props {
  data: SnapshotRevenue[];
}

const { data = [] } = defineProps<Props>();

// Refs
let revenueSerie: ISeriesApi<"Area">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    revenueSerie = chart.addAreaSeries(
      createRevenueOptionsSerie(storeSettings.theme)
    );
  }
);

// Watches
watch(() => data, createSeries);
watch(theme, (newTheme) => {
  revenueSerie.applyOptions(createRevenueOptionsSerie(newTheme));
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, storeSettings.flavor, {
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

function createRevenueOptionsSerie(theme: Theme): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lastValueVisible: false,
    priceLineVisible: false,
    ...getLineChartColors(theme, storeSettings.flavor),
  };
}

function createSeries(newRevenue: SnapshotRevenue[]): void {
  if (!chart.value || !newRevenue) {
    return;
  }

  const newRevenueSerie: LineData[] = chain(newRevenue)
    .groupBy((x) => x.timestamp)
    .mapValues((x) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: totalRevenue(x[0]),
    }))
    .entries()
    .map((x) => x[1])
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newRevenueSerie.length > 0) {
    revenueSerie.setData(newRevenueSerie);
  }

  chart.value.timeScale().fitContent();
}

const formatter = (y: number): string =>
  `$${round(y, 1, "dollar")}${unit(y, "dollar")}`;

const totalRevenue = (s: SnapshotRevenue) =>
  s.unlock_penalty_revenue_usd +
  s.borrowing_fees_revenue_usd +
  s.redemption_fees_revenue_usd;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  height: 300px;
  z-index: 0;
}
</style>
