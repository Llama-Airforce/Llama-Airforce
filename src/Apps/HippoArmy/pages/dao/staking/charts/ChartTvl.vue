<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Tvl = {
  timestamp: Date;
  tvl: number;
  tvlUsd: number;
};

const { tvl } = defineProps<{
  tvl: Tvl[];
}>();

const theme = useTheme();

// Legend
const { items, toggles, disabled } = useLegend(() => [
  {
    id: "rsup",
    label: "RSUP",
    color: theme.value.colorsArray[0],
    togglable: true,
  },
  {
    id: "dollars",
    label: "Dollars",
    color: theme.value.colorsArray[1],
    togglable: true,
  },
]);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    createAreaSerie({
      name: "rsup" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: (y: number) => `${round(y, 1, "dollar")}${unit(y)}`,
    }),
    {
      type: LineSeries,
      name: "dollars" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
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
  if (!chart.value || !series.rsup || !series.dollars) {
    return;
  }

  const newRsupSerie = tvl
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.tvl,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDollarsSerie = tvl
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.tvlUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.rsup.setData(newRsupSerie);
  series.dollars.setData(newDollarsSerie);

  series.rsup.applyOptions({ visible: toggles.rsup.value });
  series.dollars.applyOptions({ visible: toggles.dollars.value });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="TVL"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="tvl"
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
