<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['cvxPRISMA', 'yPRISMA']"
          :colors="[theme.colors.blue, theme.colors.yellow]"
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
import { chain } from "lodash";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import {
  WrapperService,
  type Contract,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

const prismaService = new WrapperService(getHost());

// Refs
let serieConvex: ISeriesApi<"Line">;
let serieYearn: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serieConvex = chart.addLineSeries(createOptionsSerie("convex"));
    serieYearn = chart.addLineSeries(createOptionsSerie("yearn"));
  }
);

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

// Watches
watch(theme, () => {
  serieConvex.applyOptions(createOptionsSerie("convex"));
  serieYearn.applyOptions(createOptionsSerie("yearn"));
});

watch([dataConvex, chart], ([newData, chart]) =>
  createSeries("convex", newData, chart)
);
watch([dataYearn, chart], ([newData, chart]) =>
  createSeries("yearn", newData, chart)
);

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    leftPriceScale: {
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

function createOptionsSerie(contract: Contract): LineSeriesPartialOptions {
  const color =
    contract === "convex" ? theme.value.colors.blue : theme.value.colors.yellow;

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries(
  contract: Contract,
  newData?: DecimalTimeSeries[],
  chart?: IChartApi
): void {
  if (!chart || !serieConvex || !serieYearn) {
    return;
  }

  const newSerie: LineData[] = chain(newData)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    if (contract === "convex") {
      serieConvex.setData(newSerie);
    } else if (contract === "yearn") {
      serieYearn.setData(newSerie);
    }

    chart.timeScale().fitContent();
  }
}

const formatter = (y: number): string => {
  return `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: 300px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: TVL
</i18n>
