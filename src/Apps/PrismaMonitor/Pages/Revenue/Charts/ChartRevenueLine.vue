<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useSettingsStore } from "@PM/Stores";
import type { SnapshotRevenue } from "@PM/Services";

const { data = [] } = defineProps<{
  data: SnapshotRevenue[];
}>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
    },
  }),
  series: {
    type: "Area",
    name: "revenue" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
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
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.revenue) {
    return;
  }

  const newRevenueSerie = data
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

<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>
