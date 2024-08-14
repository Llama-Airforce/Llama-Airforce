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

// Legend
const { theme } = storeToRefs(useSettingsStore());

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
const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
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
    }),
  series: [
    {
      type: "Line",
      name: "borrowApy" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          color: theme.value.colors.red,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
    {
      type: "Line",
      name: "lendApy" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          color: theme.value.colors.green,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watch([snapshots, chart], createSeries);
function createSeries([newSnapshots, chart]: [Snapshot[]?, IChartApi?]): void {
  if (!chart || !series.borrowApy || !series.lendApy) {
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
    series.borrowApy.setData(newBorrowApySerie);
  }

  // Lend APY serie
  if (newLendApySerie.length > 0) {
    series.lendApy.setData(newLendApySerie);
  }

  if (newBorrowApySerie.length > 0 || newLendApySerie.length > 0) {
    const from = Math.min(
      (newBorrowApySerie.at(0)?.time as UTCTimestamp | undefined) ?? Infinity,
      (newLendApySerie.at(0)?.time as UTCTimestamp | undefined) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newBorrowApySerie.at(-1)?.time as UTCTimestamp | undefined) ?? -Infinity,
      (newLendApySerie.at(-1)?.time as UTCTimestamp | undefined) ?? -Infinity
    ) as UTCTimestamp;

    chart.timeScale().setVisibleRange({ from, to });
  }
}

function formatter(x: number): string {
  return `${round(x * 100, 0, "percentage")}${unit(x, "percentage")}`;
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
title: Rates
borrow-apy: Borrow APY
lend-apy: Lend APY
</i18n>
