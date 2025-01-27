<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { Chain } from "@/Types/Chain";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import { useQuerySnapshots } from "@CM/queries/llamalend";

const { market, chain } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
  chain: Chain | undefined;
}>();

// Legend
const theme = useTheme();

const { items } = useLegend(() => [
  {
    id: "borrow",
    label: "Borrow APY",
    color: theme.value.colors.red,
  },
  {
    id: "lend",
    label: "Lend APY",
    color: theme.value.colors.green,
  },
]);

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (apy: number) => formatter(apy),
    },
  }),
  series: [
    {
      type: "Line",
      name: "borrowApy" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        color: theme.value.colors.red,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: "Line",
      name: "lendApy" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        color: theme.value.colors.green,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.borrowApy || !series.lendApy) {
    return;
  }

  const newBorrowApySerie = snapshots.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.borrowApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newLendApySerie = snapshots.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.lendApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  // Borrow APY serie
  if (newBorrowApySerie.length > 0) {
    series.borrowApy.setData(newBorrowApySerie);
  }

  // Lend APY serie
  if (newLendApySerie.length > 0) {
    series.lendApy.setData(newLendApySerie);
  }

  if (newBorrowApySerie.length > 0 || newLendApySerie.length > 0) {
    chart.value.timeScale().fitContent();
  }
}

function formatter(x: number): string {
  return `${round(x * 100, 0, "percentage")}%`;
}
</script>

<template>
  <Card
    ref="card"
    title="Rates"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="rates"
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
