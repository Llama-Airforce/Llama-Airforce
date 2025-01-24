<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { Chain } from "@/Types/Chain";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import { useQuerySnapshots } from "@CM/queries/llamalend";

const { market, chain } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Legend
const theme = useTheme();

const symbolCollateral = computed(() =>
  market ? market.tokenCollateral.symbol : "?"
);
const symbolBorrowed = computed(() =>
  market ? market.tokenBorrowed.symbol : "?"
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

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: "Line",
      name: "collateral" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: "Line",
      name: "borrowed" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.collateral || !series.borrowed) {
    return;
  }

  const denom = denomDollars.value;
  const newCollateralSerie = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: denom ? c.collateralBalanceUsd : c.collateralBalance,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newBorrowedSerie = snapshots.value
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
    chart.value.timeScale().fitContent();
  }
}

function formatter(x: number) {
  return `${denomDollars.value ? "$" : ""}${round(x, 0, "dollar")}${unit(x)}`;
}
</script>

<template>
  <Card
    ref="card"
    title="Collateral"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <ButtonToggle
          style="margin-right: 1rem"
          :model-value="denomDollars"
          @click="denomDollars = !denomDollars"
        >
          Dollars
        </ButtonToggle>

        <BtnChartLWExport
          filename="collateral"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <Legend :items />
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
