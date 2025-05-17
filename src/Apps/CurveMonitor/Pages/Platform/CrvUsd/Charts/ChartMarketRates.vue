<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQuerySnapshots } from "@CM/queries/crvusd";

const { market } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
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
    createAreaSerie({
      name: "rates" as const,
      color: computed(() => theme.value.colors.blue),
      formatter,
    }),
    {
      type: LineSeries,
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

  const dataRates = snapshots.value
    .map((c) => ({
      time: c.timestamp.getUTCTimestamp(),
      value: c.rate,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const averages = average(
    dataRates.map((x) => x.value),
    avgLength.value ?? 31
  );

  const dataEMA = averages.zip(dataRates).map((x) => ({
    time: x[1].time,
    value: x[0],
  }));

  series.ema.setData(dataEMA);
  series.rates.setData(dataRates);

  chart.value.timeScale().fitContent();
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
      />
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
