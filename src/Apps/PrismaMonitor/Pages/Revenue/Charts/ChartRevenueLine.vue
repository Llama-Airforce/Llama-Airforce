<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { type SnapshotRevenue } from "@PM/Services";

// Props
interface Props {
  data: SnapshotRevenue[];
}

const { data = [] } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        priceFormatter: (y: number): string =>
          `$${round(y, 1, "dollar")}${unit(y, "dollar")}`,
      },
    }),
  series: {
    type: "Area",
    name: "revenue" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
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
      })
    ),
  },
});

watch(() => data, createSeries);
function createSeries(newRevenue: SnapshotRevenue[]): void {
  if (!chart.value || !series.revenue) {
    return;
  }

  const newRevenueSerie: LineData[] = newRevenue
    .groupBy((x) => x.timestamp)
    .entries()
    .map(([, x]) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: totalRevenue(x[0]),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newRevenueSerie.length > 0) {
    series.revenue.setData(newRevenueSerie);
  }

  chart.value.timeScale().fitContent();
}

const totalRevenue = (s: SnapshotRevenue) =>
  s.unlock_penalty_revenue_usd +
  s.borrowing_fees_revenue_usd +
  s.redemption_fees_revenue_usd;
</script>
