<script setup lang="ts">
import { type AutoscaleInfo } from "lightweight-charts";
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import createChartOptions from "@CM/Util/ChartStyles";
import { type PoolPrice } from "@CM/Services/CrvUsd";
import {
  useQueryKeepers,
  useQueryKeeperPrices,
} from "@CM/Services/CrvUsd/Queries";

const { theme } = storeToRefs(useSettingsStore());

// Legend
const coins = ["USDC", "USDT", "TUSD", "USDP"] as const;

const { items, toggles, disabled } = useLegend(() =>
  coins.map((coin, i) => ({
    id: coin,
    label: coin,
    color: theme.value.colorsArray[i],
    togglable: true,
  }))
);

// Data
const loading = computed(
  () => loadingKeepers.value || loadingKeeperPrices.value
);
const { isFetching: loadingKeepers, data: keepers } = useQueryKeepers();
const { isFetching: loadingKeeperPrices, data: prices } =
  useQueryKeeperPrices(keepers);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: coins.map((coin, i) => ({
    type: "Line",
    name: coin,
    options: computed<LineSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) =>
          `${round(y, 3, "dollar")}${unit(y, "dollar")}`,
      },
      lineWidth: 2,
      lineType: LineType.WithSteps,
      color: theme.value.colorsArray[i],
      lastValueVisible: false,
      priceLineVisible: false,
      autoscaleInfoProvider: (original: () => AutoscaleInfo | null) => {
        const res = original();

        if (res !== null) {
          res.priceRange.minValue = Math.max(0.98, res.priceRange.minValue);
          res.priceRange.maxValue = Math.min(1.02, res.priceRange.maxValue);
        }

        return res;
      },
    })),
  })),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || Object.values(series).length < 0) {
    return;
  }

  for (const [, coin] of coins.entries()) {
    // Don't render disabled coins. But keep the serie so colors don't get mixed up.
    if (!toggles[coin].value) {
      series[coin]?.setData([]);
      continue;
    }

    const newLineSerie = (prices.value as PoolPrice[])
      .map((x) => ({
        time: x.timestamp as UTCTimestamp,
        value: x[coin],
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc");

    if (newLineSerie.length > 0) {
      series[coin]?.setData(newLineSerie);
    }
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Pegkeepers Coin Prices"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="keeper_prices"
          :series
        ></BtnChartLWExport>

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
      ></Legend>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
