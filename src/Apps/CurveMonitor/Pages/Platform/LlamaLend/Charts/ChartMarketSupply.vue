<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { useQuerySnapshots } from "@CM/queries/llamalend";
import type { Chain } from "@curvefi/prices-api";

const { market, chain } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
  chain: Chain | undefined;
}>();

// Legend
const theme = useTheme();

const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow, purple } = theme.value.colors;
  return [
    { id: "supply", label: "Supply", color: blue },
    { id: "debt", label: "Debt", color: yellow },
    { id: "util", label: "Util %", color: purple, togglable: true },
  ];
});

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(
    computed(() => ({
      leftPriceScale: {
        visible: toggles.util.value,
      },
    }))
  ),
  series: [
    {
      type: LineSeries,
      name: "supply" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `$${round(x, 0, "dollar")}${unit(x)}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "debt" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) => `$${round(x, 0, "dollar")}${unit(x)}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: LineSeries,
      name: "util" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number): string => `${Math.round(x * 100)}%`,
          minMove: 0.01,
        },
        priceScaleId: "left",
        lineWidth: 2,
        color: theme.value.colors.purple,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.supply || !series.debt || !series.util) {
    return;
  }

  const dataSupply = snapshots.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.totalAssetsUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const dataDebt = snapshots.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.totalDebtUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const dataUtil = dataSupply
    .zip(dataDebt)
    .map(([supply, debt]) => ({
      time: debt.time,
      value: supply.value > 0 ? debt.value / supply.value : 0,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.supply.setData(dataSupply);
  series.debt.setData(dataDebt);
  series.util.setData(dataUtil);

  series.util.applyOptions({ visible: toggles.util.value });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Supply & Debt"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="supply_debt_util"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <Legend
        :items
        :disabled
        @toggle="toggles[$event].value = !toggles[$event].value"
      />
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
