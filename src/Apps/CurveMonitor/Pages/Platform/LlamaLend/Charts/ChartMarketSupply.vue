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
      type: "Line",
      name: "supply" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number) =>
            `$${round(x, 0, "dollar")}${unit(x, "dollar")}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: "Line",
      name: "debt" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number): string =>
            `$${round(x, 0, "dollar")}${unit(x, "dollar")}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
    {
      type: "Line",
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

  const newSupplySerie = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.totalAssetsUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDebtSerie = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.totalDebtUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newUtilSerie = (toggles.util.value ? newSupplySerie : [])
    .zip(newDebtSerie)
    .map(([supply, debt]) => ({
      time: debt.time,
      value: supply.value > 0 ? debt.value / supply.value : 0,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.supply.setData(newSupplySerie);
  series.debt.setData(newDebtSerie);
  series.util.setData(newUtilSerie);

  series.util.applyOptions({ visible: toggles.util.value });

  if (newSupplySerie.length > 0 || newDebtSerie.length > 0) {
    const from = Math.min(
      newSupplySerie.at(0)?.time ?? Infinity,
      newDebtSerie.at(0)?.time ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      newSupplySerie.at(-1)?.time ?? -Infinity,
      newDebtSerie.at(-1)?.time ?? -Infinity
    ) as UTCTimestamp;

    chart.value.timeScale().setVisibleRange({ from, to });
  }
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
        ></BtnChartLWExport>

        <BtnChartLWFullscreen
          :chart
          :target="card?.$el"
        />
      </div>
    </template>

    <template #actions-secondary>
      <Legend
        :items
        :disabled
        @toggle="toggles[$event].value = !toggles[$event].value"
      ></Legend>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
