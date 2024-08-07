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

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import {
  CollateralService,
  type TroveManagerDetails,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}

const { vault = null } = defineProps<Props>();

// Refs
let oracleSerie: ISeriesApi<"Area">;
let marketSerie: ISeriesApi<"Area">;

const { theme, flavor } = storeToRefs(useSettingsStore());

// Legend
const { items } = useLegend(() => [
  {
    id: "oracle",
    label: "Oracle",
    color: theme.value.colorsArray[0],
  },
  {
    id: "market",
    label: "Market",
    color: theme.value.colorsArray[1],
  },
]);

// Services
const collateralService = new CollateralService(flavor.value);

// Data
const init = {
  oracle: [],
  market: [],
};

const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-stable-distribution",
    computed(() => vault?.collateral),
  ] as const,
  queryFn: async ({ queryKey: [, collateral] }) => {
    if (collateral) {
      const xs = await collateralService.getCollateralPrices(
        "ethereum",
        collateral,
        "7d"
      );

      return processSeries(xs.oracle, xs.market);
    } else {
      return Promise.resolve(init);
    }
  },
  initialData: init,
  initialDataUpdatedAt: 0,
});

// Methods
const processSeries = (
  oracle: DecimalTimeSeries[],
  market: DecimalTimeSeries[]
): { oracle: DecimalTimeSeries[]; market: DecimalTimeSeries[] } => {
  const startTimestamp = Math.max(oracle[0].timestamp, market[0].timestamp);
  const endTimestamp = Math.min(
    oracle[oracle.length - 1].timestamp,
    market[market.length - 1].timestamp
  );

  const filteredOracle = oracle.filter(
    (point) =>
      point.timestamp >= startTimestamp && point.timestamp <= endTimestamp
  );
  const filteredMarket = market.filter(
    (point) =>
      point.timestamp >= startTimestamp && point.timestamp <= endTimestamp
  );

  if (filteredOracle[filteredOracle.length - 1].timestamp < endTimestamp) {
    filteredOracle.push({
      timestamp: endTimestamp,
      value: filteredOracle[filteredOracle.length - 1].value,
    });
  }

  if (filteredMarket[filteredMarket.length - 1].timestamp < endTimestamp) {
    filteredMarket.push({
      timestamp: endTimestamp,
      value: filteredMarket[filteredMarket.length - 1].value,
    });
  }

  return { oracle: filteredOracle, market: filteredMarket };
};

// Chart
const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    oracleSerie = chart.addAreaSeries(createProportionOptionsSerie());
    marketSerie = chart.addAreaSeries(createPriceOptionsSerie());
  }
);

watch([data, chart], createSeries);
watch(theme, () => {
  oracleSerie.applyOptions(createProportionOptionsSerie());
  marketSerie.applyOptions(createPriceOptionsSerie());
});

function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    leftPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createPriceOptionsSerie(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.yellow,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createProportionOptionsSerie(): AreaSeriesPartialOptions {
  return {
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
  };
}

function createSeries([newData, chart]: [
  {
    oracle: DecimalTimeSeries[];
    market: DecimalTimeSeries[];
  }?,
  IChartApi?
]): void {
  if (!chart || !oracleSerie) {
    return;
  }

  const newOracleSerie: LineData[] = chain(newData?.oracle)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newMarketSerie: LineData[] = chain(newData?.market)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newMarketSerie.length > 0) {
    marketSerie.setData(newMarketSerie);
  }

  if (newOracleSerie.length > 0) {
    oracleSerie.setData(newOracleSerie);
  }

  chart.timeScale().fitContent();
}
</script>

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
title: Oracle & Market price
</i18n>
