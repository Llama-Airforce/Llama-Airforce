<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend :items="legend"></Legend>

        <ButtonToggle
          value="Dollars"
          :model-value="denomDollars"
          @click="denomDollars = !denomDollars"
        >
        </ButtonToggle>
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
let collateralSerie: ISeriesApi<"Line">;
let borrowedSerie: ISeriesApi<"Line">;

const denomDollars = ref(true);

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    collateralSerie = chart.addLineSeries(createOptionsSerieCollateral());
    borrowedSerie = chart.addLineSeries(createOptionsSerieBorrowed());
  }
);

const symbolCollateral = computed(
  () => market?.collateral_token?.symbol ?? "?"
);
const symbolBorrowed = computed(() => market?.borrowed_token?.symbol ?? "?");

const legend = computed(() => [
  {
    id: symbolCollateral.value,
    label: symbolCollateral.value,
    color: theme.value.colors.blue,
  },
  {
    id: symbolBorrowed.value,
    label: symbolBorrowed.value,
    color: theme.value.colors.yellow,
  },
]);

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Watches
watch([snapshots, chart, denomDollars], createSeries);
watch(theme, () => {
  collateralSerie.applyOptions(createOptionsSerieCollateral());
  borrowedSerie.applyOptions(createOptionsSerieBorrowed());
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerieCollateral(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    color: theme.value.colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createOptionsSerieBorrowed(): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter,
    },
    lineWidth: 2,
    color: theme.value.colors.yellow,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newSnapshots, chart, newDenomDollars]: [
  Snapshot[]?,
  IChartApi?,
  boolean?
]): void {
  if (!chart || !collateralSerie || !borrowedSerie) {
    return;
  }

  const newCollateralSerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: newDenomDollars ? c.collateralBalanceUsd : c.collateralBalance,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const newBorrowedSerie: LineData[] = chain_(newSnapshots)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: newDenomDollars ? c.borrowedBalanceUsd : c.borrowedBalance,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  // Borrow APY serie
  if (newCollateralSerie.length > 0) {
    collateralSerie.setData(newCollateralSerie);
  }

  // Lend APY serie
  if (newBorrowedSerie.length > 0) {
    borrowedSerie.setData(newBorrowedSerie);
  }

  if (newCollateralSerie.length > 0 || newBorrowedSerie.length > 0) {
    const from = Math.min(
      (newCollateralSerie[0]?.time as UTCTimestamp) ?? Infinity,
      (newBorrowedSerie[0]?.time as UTCTimestamp) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newCollateralSerie[newCollateralSerie.length - 1]
        ?.time as UTCTimestamp) ?? -Infinity,
      (newBorrowedSerie[newBorrowedSerie.length - 1]?.time as UTCTimestamp) ??
        -Infinity
    ) as UTCTimestamp;

    chart.timeScale().setVisibleRange({ from, to });
  }
}

const formatter = (x: number): string =>
  `${denomDollars.value ? "$" : ""}${round(x, 0, "dollar")}${unit(
    x,
    "dollar"
  )}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Collateral
</i18n>
