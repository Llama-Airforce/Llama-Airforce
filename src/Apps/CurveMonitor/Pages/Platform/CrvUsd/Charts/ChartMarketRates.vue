<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <InputNumber
          v-model="avgLength"
          class="avg-span"
          placeholder="Avg span (days)"
          :min="1"
          :max="Infinity"
        ></InputNumber>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type Market, type Snapshot } from "@CM/Services/CrvUsd";
import { useQuerySnapshots } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);

// Chart
const { theme } = storeToRefs(useSettingsStore());
const avgLength = ref<number | null>(null);

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      height: 300,
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    }),
  series: [
    {
      type: "Area",
      name: "rates" as const,
      options: computed(
        (): AreaSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          lineColor: theme.value.colors.blue,
          topColor: "rgb(32, 129, 240, 0.2)",
          bottomColor: "rgba(32, 129, 240, 0)",
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
    {
      type: "Line",
      name: "ema" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          color: theme.value.colors.yellow,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watch([snapshots, chart], createSeries);
watch(avgLength, () => {
  createSeries([snapshots.value, chart.value]);
});
function createSeries([newRates, chart]: [Snapshot[]?, IChartApi?]): void {
  if (!chart || !series.rates || !series.ema) {
    return;
  }

  const newRatesSerie: LineData[] = chain(newRates)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.rate,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  const averages = average(
    newRatesSerie.map((x) => x.value),
    avgLength.value ?? 31
  );

  const newRatesEMASerie: LineData[] = chain(averages)
    .zip(newRatesSerie)
    .map((x) => ({
      time: x[1]!.time,
      value: x[0]!,
    }))
    .value();

  // EMA rates serie.
  if (newRatesEMASerie.length > 0) {
    series.ema.setData(newRatesEMASerie);
  }

  // Normal rates serie.
  if (newRatesSerie.length > 0) {
    series.rates.setData(newRatesSerie);

    const from = newRatesSerie[0].time;
    const to = newRatesSerie[newRatesSerie.length - 1].time;

    chart.timeScale().setVisibleRange({ from, to });
  }
}

function formatter(x: number): string {
  return `${round(x * 100, 0, "percentage")}${unit(x, "percentage")}`;
}

/**
 * Normal non-weighted N sized average.
 * let values: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * output: [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7]
 */
const average = (data: number[], n = 7): number[] =>
  data.map((_x, i) => {
    // Start from the current index and go back (n - 1) more days (total n days)
    const start = Math.max(i - (n - 1), 0);
    const end = i + 1;

    // Slice the portion of the array for the n-day average and compute its average
    const slice = data.slice(start, end);
    const average = slice.reduce((acc, value) => acc + value, 0) / slice.length;

    return average;
  });
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }

  .actions {
    > .avg-span {
      width: 8rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Rates
</i18n>
