<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { type SnapshotRevenue } from "@PM/Services";

// Props
interface Props {
  data: SnapshotRevenue[];
}

const { data = [] } = defineProps<Props>();

// Refs
let revenueSerie: ISeriesApi<"Area"> | undefined;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    revenueSerie = chart.addAreaSeries(createRevenueOptionsSerie());
  }
);

// Watches
watch(() => data, createSeries);
watch(theme, () => {
  revenueSerie?.applyOptions(createRevenueOptionsSerie());
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
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
}

function createRevenueOptionsSerie(): AreaSeriesPartialOptions {
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
    ...theme.value.lineChartColors,
  };
}

function createSeries(newRevenue: SnapshotRevenue[]): void {
  if (!chart.value || !revenueSerie) {
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
