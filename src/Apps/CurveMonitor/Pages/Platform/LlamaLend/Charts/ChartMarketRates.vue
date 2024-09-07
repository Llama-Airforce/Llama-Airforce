<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import createChartOptions from "@CM/Util/ChartStyles";
import { type Market } from "@CM/Services/LlamaLend";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// Legend
const { theme } = storeToRefs(useSettingsStore());

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
      time: c.timestamp as UTCTimestamp,
      value: c.borrowApy,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newLendApySerie = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
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
    const from = Math.min(
      newBorrowApySerie.at(0)?.time ?? Infinity,
      newLendApySerie.at(0)?.time ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      newBorrowApySerie.at(-1)?.time ?? -Infinity,
      newLendApySerie.at(-1)?.time ?? -Infinity
    ) as UTCTimestamp;

    chart.value.timeScale().setVisibleRange({ from, to });
  }
}

function formatter(x: number): string {
  return `${round(x * 100, 0, "percentage")}${unit(x, "percentage")}`;
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
        ></BtnChartLWExport>

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <Legend :items></Legend>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
