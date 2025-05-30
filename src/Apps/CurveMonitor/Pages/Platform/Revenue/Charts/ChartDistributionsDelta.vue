<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { Distribution } from "@curvefi/prices-api/revenue";

const { distributions } = defineProps<{
  distributions: Distribution[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: HistogramSeries,
    name: "deltas" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) => `$${round(x, 0, "dollar")}${unit(x)}`,
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

  series.deltas.setData(
    distributions
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
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
      }, [])
  );

  chart.value.timeScale().fitContent();
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
        />

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
