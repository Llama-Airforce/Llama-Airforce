<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { type Market } from "@CM/Services/CrvUsd";
import { useQuerySnapshots } from "@CM/Services/CrvUsd/Queries";

const { market } = defineProps<{
  market: Market | undefined;
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);

// Chart
const theme = useTheme();
const avgLength = ref<number | null>(null);

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    {
      type: "Area",
      name: "rates" as const,
      options: computed<AreaSeriesPartialOptions>(() => ({
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
      })),
    },
    {
      type: "Line",
      name: "ema" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.rates || !series.ema) {
    return;
  }

  const newRatesSerie = snapshots.value
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.rate,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const averages = average(
    newRatesSerie.map((x) => x.value),
    avgLength.value ?? 31
  );

  const newRatesEMASerie = averages.zip(newRatesSerie).map((x) => ({
    time: x[1].time,
    value: x[0],
  }));

  // EMA rates serie.
  if (newRatesEMASerie.length > 0) {
    series.ema.setData(newRatesEMASerie);
  }

  // Normal rates serie.
  if (newRatesSerie.length > 0) {
    series.rates.setData(newRatesSerie);

    const from = newRatesSerie[0].time;
    const to = newRatesSerie[newRatesSerie.length - 1].time;

    chart.value.timeScale().setVisibleRange({ from, to });
  }
}

function formatter(x: number) {
  return `${round(x * 100, 0, "percentage")}%`;
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

<template>
  <Card
    title="Rates"
    :loading
  >
    <template #actions>
      <InputNumber
        v-model="avgLength"
        class="avg-span"
        placeholder="Avg span (days)"
        :min="1"
        :max="Infinity"
      ></InputNumber>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style scoped>
.avg-span {
  width: 8rem;
}
</style>
