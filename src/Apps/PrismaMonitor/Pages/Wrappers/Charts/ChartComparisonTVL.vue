<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import {
  WrapperService,
  type Contract,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService();

// Legend
const { theme } = storeToRefs(useSettingsStore());

const { items } = useLegend(() => [
  {
    id: "cvxprisma",
    label: "cvxPRISMA",
    color: theme.value.colors.blue,
  },
  {
    id: "yprisma",
    label: "yPRISMA",
    color: theme.value.colors.yellow,
  },
]);

// Data
const loading = computed(() => loadingConvex.value || loadingYearn.value);

const { isFetching: loadingConvex, data: dataConvex } = useQuery({
  queryKey: ["prisma-wrapper-tvl", "convex"] as const,
  queryFn: () => prismaService.getTVL("convex").then((x) => x.tvl),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const { isFetching: loadingYearn, data: dataYearn } = useQuery({
  queryKey: ["prisma-wrapper-tvl", "yearn"] as const,
  queryFn: () => prismaService.getTVL("yearn").then((x) => x.tvl),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Chart
const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        priceFormatter: (price: number) => formatter(price),
      },
    }),
  series: [
    {
      type: "Line",
      name: "convex" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "price",
            precision: 6,
            minMove: 0.000001,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          color: theme.value.colors.blue,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
    {
      type: "Line",
      name: "yearn" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "price",
            precision: 6,
            minMove: 0.000001,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          color: theme.value.colors.yellow,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watch([dataConvex, chart], ([data, chart]) => {
  createSeries("convex", data, chart);
});
watch([dataYearn, chart], ([data, chart]) => {
  createSeries("yearn", data, chart);
});

function createSeries(
  contract: Contract,
  newData?: DecimalTimeSeries[],
  chart?: IChartApi
): void {
  if (!chart || !series.convex || !series.yearn) {
    return;
  }

  const newSerie: LineData[] = (newData ?? [])
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    if (contract === "convex") {
      series.convex.setData(newSerie);
    } else {
      series.yearn.setData(newSerie);
    }

    chart.timeScale().fitContent();
  }
}

function formatter(y: number): string {
  return `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
}
</script>

<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend :items></Legend>
      </div>
    </template>
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: TVL
</i18n>
