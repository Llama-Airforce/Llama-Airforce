<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { useSettingsStore } from "@CM/Stores";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market } from "@CM/Services/LlamaLend";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Legend
const { theme } = storeToRefs(useSettingsStore());

const symbolCollateral = computed(() =>
  market ? market.collateral_token.symbol : "?"
);
const symbolBorrowed = computed(() =>
  market ? market.borrowed_token.symbol : "?"
);

const { items } = useLegend(() => [
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

// Chart
const denomDollars = ref(true);

const { chart, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: [
    {
      type: "Line",
      name: "collateral" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          color: theme.value.colors.blue,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
    {
      type: "Line",
      name: "borrowed" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          color: theme.value.colors.yellow,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.collateral || !series.borrowed) {
    return;
  }

  const denom = denomDollars.value;
  const newCollateralSerie: LineData[] = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: denom ? c.collateralBalanceUsd : c.collateralBalance,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newBorrowedSerie: LineData[] = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: denom ? c.borrowedBalanceUsd : c.borrowedBalance,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  // Borrow APY serie
  if (newCollateralSerie.length > 0) {
    series.collateral.setData(newCollateralSerie);
  }

  // Lend APY serie
  if (newBorrowedSerie.length > 0) {
    series.borrowed.setData(newBorrowedSerie);
  }

  if (newCollateralSerie.length > 0 || newBorrowedSerie.length > 0) {
    const from = Math.min(
      (newCollateralSerie.at(0)?.time as UTCTimestamp | undefined) ?? Infinity,
      (newBorrowedSerie.at(0)?.time as UTCTimestamp | undefined) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newCollateralSerie.at(-1)?.time as UTCTimestamp | undefined) ??
        -Infinity,
      (newBorrowedSerie.at(-1)?.time as UTCTimestamp | undefined) ?? -Infinity
    ) as UTCTimestamp;

    chart.value.timeScale().setVisibleRange({ from, to });
  }
}

function formatter(x: number): string {
  return `${denomDollars.value ? "$" : ""}${round(x, 0, "dollar")}${unit(
    x,
    "dollar"
  )}`;
}
</script>

<template>
  <Card
    title="Collateral"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend :items></Legend>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.actions {
  display: flex;
  gap: 1rem;
}
</style>
