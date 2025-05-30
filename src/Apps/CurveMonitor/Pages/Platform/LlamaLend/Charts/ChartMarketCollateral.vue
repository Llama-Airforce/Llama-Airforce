<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useQuerySnapshots } from "@CM/queries/llamalend";
import type { Chain } from "@curvefi/prices-api";

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
  market ? market.collateralToken.symbol : "?"
);
const symbolBorrowed = computed(() =>
  market ? market.borrowedToken.symbol : "?"
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
      type: LineSeries,
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
      type: LineSeries,
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

  series.collateral.setData(
    snapshots.value
      .map((c) => ({
        time: c.timestamp.getUTCTimestamp(),
        value: denom ? c.collateralBalanceUsd : c.collateralBalance,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  series.borrowed.setData(
    snapshots.value
      .map((c) => ({
        time: c.timestamp.getUTCTimestamp(),
        value: denom ? c.borrowedBalanceUsd : c.borrowedBalance,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  chart.value.timeScale().fitContent();
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
