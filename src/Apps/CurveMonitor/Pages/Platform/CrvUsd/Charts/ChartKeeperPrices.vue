<script setup lang="ts">
import { type AutoscaleInfo } from "lightweight-charts";
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWFullscreen } from "@CM/Components/";
import createChartStyles from "@CM/Util/ChartStyles";
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
const fullscreen = ref(false);
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: (chartRef) =>
    computed(() => createChartStyles(chartRef, theme.value)),
  series: coins.map((coin, i) => ({
    type: "Line",
    name: coin,
    options: computed(
      (): LineSeriesPartialOptions => ({
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
      })
    ),
  })),
});

watchEffect(createSeries);
function createSeries(): void {
  if (!chart.value || Object.values(series).length < 0) {
    return;
  }

  for (const [, coin] of coins.entries()) {
    // Don't render disabled coins. But keep the serie so colors don't get mixed up.
    if (!toggles[coin].value) {
      series[coin]?.setData([]);
      continue;
    }

    const newLineSerie: LineData[] = (prices.value as PoolPrice[])
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
    title="Stablecoin Prices of Pegkeepers"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items
          :disabled
          @toggle="toggles[$event].value = !toggles[$event].value"
        ></Legend>

        <BtnChartLWFullscreen
          v-model="fullscreen"
          :chart="chart"
          :target="card?.$el"
        />
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
