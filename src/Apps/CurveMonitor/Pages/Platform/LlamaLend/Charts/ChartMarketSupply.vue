<template>
  <Card
    ref="chartCard"
    class="chart-card"
    :title="t('title')"
    :loading
    :class="{ fullscreen }"
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
          :target="chartCard?.$el"
        />
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWFullscreen } from "@CM/Components/";
import { useQuerySnapshots } from "@CM/Services/LlamaLend/Queries";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

// Legend
const { theme, themeId } = storeToRefs(useSettingsStore());

const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow, purple } = theme.value.colors;
  return [
    { id: "supply", label: t("supply"), color: blue },
    { id: "debt", label: t("debt"), color: yellow },
    { id: "util", label: t("util"), color: purple, togglable: true },
  ];
});

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market),
  toRef(() => chain)
);

// Chart
const fullscreen = ref(false);
const chartCard = ref<ComponentPublicInstance | undefined>(undefined);

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: computed(
    () => `${themeId.value}-${toggles.util.value}`
  ),
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      leftPriceScale: {
        visible: toggles.util.value,
      },
    }),
  series: [
    {
      type: "Line",
      name: "supply" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter: (x: number): string =>
              `$${round(x, 0, "dollar")}${unit(x, "dollar")}`,
            minMove: 0.01,
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
      name: "debt" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
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
        })
      ),
    },
    {
      type: "Line",
      name: "util" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
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
        })
      ),
    },
  ],
});

watchEffect(createSeries);
function createSeries(): void {
  if (!chart.value || !series.supply || !series.debt || !series.util) {
    return;
  }

  const newSupplySerie: LineData[] = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.totalAssetsUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDebtSerie: LineData[] = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.totalDebtUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newUtilSerie: LineData[] = (toggles.util.value ? newSupplySerie : [])
    .zip(newDebtSerie)
    .map(([supply, debt]) => ({
      time: debt.time as UTCTimestamp,
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
      (newSupplySerie.at(0)?.time as UTCTimestamp | undefined) ?? Infinity,
      (newDebtSerie.at(0)?.time as UTCTimestamp | undefined) ?? Infinity
    ) as UTCTimestamp;

    const to = Math.max(
      (newSupplySerie.at(-1)?.time as UTCTimestamp | undefined) ?? -Infinity,
      (newDebtSerie.at(-1)?.time as UTCTimestamp | undefined) ?? -Infinity
    ) as UTCTimestamp;

    chart.value.timeScale().setVisibleRange({ from, to });
  }
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-card {
  :deep(.card-body) {
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
title: Supply & Debt
supply: Supply
debt: Debt
util: Util (%)
</i18n>
