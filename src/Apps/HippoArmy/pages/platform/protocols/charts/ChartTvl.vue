<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Tvl = {
  timestamp: Date;
  underlying: number;
  debt: number;
};

const { tvl } = defineProps<{
  tvl: Tvl[];
}>();

const theme = useTheme();

// Legend
const { items, toggles, disabled } = useLegend(() => [
  {
    id: "underlying",
    label: "Underlying",
    color: theme.value.colorsArray[0],
    togglable: true,
  },
  {
    id: "debt",
    label: "Debt",
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
      name: "underlying" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
    }),
    {
      type: LineSeries,
      name: "debt" as const,
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
  if (!chart.value || !series.underlying || !series.debt) {
    return;
  }

  const newUnderlyingSerie = tvl
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.underlying,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDebtSerie = tvl
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.debt,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.underlying.setData(newUnderlyingSerie);
  series.debt.setData(newDebtSerie);

  series.underlying.applyOptions({ visible: toggles.underlying.value });
  series.debt.applyOptions({ visible: toggles.debt.value });

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
