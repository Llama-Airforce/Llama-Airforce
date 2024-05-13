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
import { chain } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import CurveService, {
  type CollateralRatios,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
let areaSerie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    areaSerie = chart.addAreaSeries(createOptionsSerie());
  }
);

// Data
const { isFetching: loading, data: ratios } = useQuery({
  queryKey: [
    "crvusd-liq-collateral-ratio",
    computed(() => market?.address),
  ] as const,
  queryFn: ({ queryKey: [, market] }) => {
    if (market) {
      return curveService
        .getHistoricalCollateralRatio(market)
        .then((x) => x.ratios);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Watches
watch([ratios, chart], createSeries);
watch(theme, () => areaSerie.applyOptions(createOptionsSerie()));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "percent",
      precision: 2,
      minMove: 0.1,
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

function createSeries([newRatios, chart]: [
  CollateralRatios[]?,
  IChartApi?
]): void {
  if (!chart || !areaSerie) {
    return;
  }

  const newSerie: LineData[] = chain(newRatios)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.ratio * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    areaSerie.setData(newSerie);
  }

  chart.timeScale().fitContent();
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: 200px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Collateral Ratio
</i18n>
