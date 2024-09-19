<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import { type Distribution } from "@CM/Services/Revenue";

const { distributions } = defineProps<{
  distributions: Distribution[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Histogram",
    name: "deltas" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) =>
          `$${round(x, 0, "dollar")}${unit(x, "dollar")}`,
        minMove: 0.01,
      },
      color: theme.value.colors.blue,
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.deltas) {
    return;
  }

  const { colors } = theme.value;

  const newDistributionsSeries = distributions
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.feesUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .takeRight(53) // Take 53 weeks to calculate 52 deltas
    .reduce<HistogramData[]>((acc, curr, index, array) => {
      if (index === 0) return acc;

      const value = curr.value - array[index - 1].value;
      const color = value < 0 ? colors.red : colors.green;

      acc.push({
        time: curr.time,
        value,
        color,
      });
      return acc;
    }, []);

  if (newDistributionsSeries.length > 0) {
    series.deltas.setData(newDistributionsSeries);

    const from = newDistributionsSeries[0].time;
    const to = newDistributionsSeries[newDistributionsSeries.length - 1].time;
    chart.value.timeScale().setVisibleRange({ from, to });
  }
}
</script>

<template>
  <Card
    ref="card"
    title="Distributions Change (1y)"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="distributions_delta"
          :series
        ></BtnChartLWExport>

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
