<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useSettingsStore } from "@PM/Stores";
import { StabilityPoolService } from "@PM/Services";

const { t } = useI18n();

// Refs
const { theme, flavor } = storeToRefs(useSettingsStore());

const sbService = new StabilityPoolService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-cum-withdrawals"],
  queryFn: () =>
    sbService
      .getCumulativeWithdrawals("ethereum", "all")
      .then((x) => x.withdrawals),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
    },
  }),
  series: {
    type: "Area",
    name: "withdrawals" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.001,
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
  if (!chart.value || !series.withdrawals) {
    return;
  }

  const newSerie = data.value
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.withdrawals.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    :title="t('title')"
    :loading="loading"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: Cumulative value of collaterals withdrawn
</i18n>
