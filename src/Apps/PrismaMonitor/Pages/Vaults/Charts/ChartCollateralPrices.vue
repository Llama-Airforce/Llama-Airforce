<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import createChartOptions from "@PM/Util/ChartStyles";
import {
  CollateralService,
  type TroveManagerDetails,
  type DecimalTimeSeries,
} from "@PM/Services";

const { t } = useI18n();

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();

// Refs
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
const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: "Area",
      name: "oracle" as const,
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
    {
      type: "Area",
      name: "market" as const,
      options: computed<AreaSeriesPartialOptions>(() => ({
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
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.oracle || !series.market) {
    return;
  }

  const newOracleSerie = data.value.oracle
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newMarketSerie = data.value.market
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.value,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newMarketSerie.length > 0) {
    series.market.setData(newMarketSerie);
  }

  if (newOracleSerie.length > 0) {
    series.oracle.setData(newOracleSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
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

<i18n lang="yaml" locale="en">
title: Oracle & Market price
</i18n>
