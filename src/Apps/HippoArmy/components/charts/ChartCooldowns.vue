<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";

type Cooldowns = {
  timestamp: Date;
  amount: number;
  percentage: number;
};

const { cooldowns } = defineProps<{
  cooldowns: Cooldowns[];
}>();

const theme = useTheme();

// Legend
const { items, toggles, disabled } = useLegend(() => [
  {
    id: "amount",
    label: "Amount",
    color: theme.value.colorsArray[0],
    togglable: true,
  },
  {
    id: "percentage",
    label: "Percentage",
    color: theme.value.colorsArray[1],
    togglable: true,
  },
]);

// Chart
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    leftPriceScale: {
      visible: true,
      scaleMargins: {
        top: 0.05,
        bottom: 0.05,
      },
    },
  }),
  series: [
    createAreaSerie({
      name: "amount" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: (y: number) => `${round(y, 1, "dollar")}${unit(y)}`,
    }),
    {
      type: LineSeries,
      name: "percentage" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "percent",
          precision: 1,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        color: theme.value.colors.yellow,
        lastValueVisible: false,
        priceLineVisible: false,
        priceScaleId: "left",
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: 0,
            maxValue: 100,
          },
        }),
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.amount || !series.percentage) {
    return;
  }

  const newAmountSerie = cooldowns
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.amount,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newPercentageSerie = cooldowns
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.percentage,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.amount.setData(newAmountSerie);
  series.percentage.setData(newPercentageSerie);

  series.amount.applyOptions({ visible: toggles.amount.value });
  series.percentage.applyOptions({ visible: toggles.percentage.value });

  chart.value
    .priceScale("right")
    .applyOptions({ visible: toggles.amount.value });

  chart.value
    .priceScale("left")
    .applyOptions({ visible: toggles.percentage.value });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Cooldowns"
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
