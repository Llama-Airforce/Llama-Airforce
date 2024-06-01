<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
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
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { useSettingsStore } from "@CM/Stores";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market, type Snapshot } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

// Refs
let borrowApySerie: ISeriesApi<"Line">;
let lendApySerie: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

// Legend
const { items } = useLegend(() => [
  {
    id: "borrow",
    label: t("borrow-apy"),
    color: theme.value.colors.red,
  },
  {
    id: "lend",
    label: t("lend-apy"),
    color: theme.value.colors.green,
  },
]);

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Chart
const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    borrowApySerie = chart.addLineSeries(createOptionsSerieBorrowApy());
    lendApySerie = chart.addLineSeries(createOptionsLendApy());
  }
);

watch([snapshots, chart], createSeries);
watch(theme, () => {
  borrowApySerie.applyOptions(createOptionsSerieBorrowApy());
  lendApySerie.applyOptions(createOptionsLendApy());
});

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
      priceFormatter: (apy: number) => formatter(apy),
    },
  });
}

function createOptionsSerieBorrowApy(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    color: theme.value.colors.red,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createOptionsLendApy(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    color: theme.value.colors.green,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSnapshots, chart]: [Snapshot[]?, IChartApi?]): void {
  if (!chart || !borrowApySerie || !lendApySerie) {
    return;
  }

  const newBorrowApySerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.borrowApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newLendApySerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.lendApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  // Borrow APY serie
  if (newBorrowApySerie.length > 0) {
    borrowApySerie.setData(newBorrowApySerie);
  }

  // Lend APY serie
  if (newLendApySerie.length > 0) {
    lendApySerie.setData(newLendApySerie);
  }

  if (newBorrowApySerie.length > 0 || newLendApySerie.length > 0) {
    const from = Math.min(
      (newBorrowApySerie[0]?.time as UTCTimestamp) ?? Infinity,
      (newLendApySerie[0]?.time as UTCTimestamp) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newBorrowApySerie[newBorrowApySerie.length - 1]?.time as UTCTimestamp) ??
        -Infinity,
      (newLendApySerie[newLendApySerie.length - 1]?.time as UTCTimestamp) ??
        -Infinity
    ) as UTCTimestamp;

    chart.timeScale().setVisibleRange({ from, to });
  }
}

const formatter = (x: number): string =>
  `${round(x * 100, 0, "percentage")}${unit(x, "percentage")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Rates
borrow-apy: Borrow APY
lend-apy: Lend APY
</i18n>
