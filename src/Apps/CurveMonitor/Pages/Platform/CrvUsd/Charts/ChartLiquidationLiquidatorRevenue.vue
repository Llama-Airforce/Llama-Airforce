<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['Liquidator Revenue', 'Discount']"
          :colors="theme.colorsArray"
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
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import CurveService, {
  type LiquidatorRevenue,
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
let discountSerie: ISeriesApi<"Area">;
let revenueSerie: ISeriesApi<"Area">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    discountSerie = chart.addAreaSeries(createDiscountOptionsSerie());
    revenueSerie = chart.addAreaSeries(createRevenueOptionsSerie());
  }
);

// Data
const { isFetching: loading, data: softLiqs } = useQuery({
  queryKey: ["crvusd-liq-revenue", computed(() => market?.address)] as const,
  queryFn: ({ queryKey: [, market] }) => {
    if (market) {
      return curveService.getLiquidatorRevenue(market).then((x) => x.revenue);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Watches
watch([softLiqs, chart], createSeries);
watch(theme, () => {
  discountSerie.applyOptions(createDiscountOptionsSerie());
  revenueSerie.applyOptions(createRevenueOptionsSerie());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    leftPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createRevenueOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 0,
      minMove: 1,
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

function createDiscountOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "percent",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.yellow,
    priceScaleId: "left",
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSoftLiq, chart]: [
  LiquidatorRevenue[]?,
  IChartApi?
]): void {
  if (!chart || !discountSerie) {
    return;
  }

  const newDiscountSerie: LineData[] = chain(newSoftLiq)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.discount * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newRevenueSerie: LineData[] = chain(newSoftLiq)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.amount,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newRevenueSerie.length > 0) {
    revenueSerie.setData(newRevenueSerie);
  }

  if (newDiscountSerie.length > 0) {
    discountSerie.setData(newDiscountSerie);
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
title: Liquidator Revenue
</i18n>
