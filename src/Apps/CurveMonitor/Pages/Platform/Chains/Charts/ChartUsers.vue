<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/components";

type Users = {
  timestamp: number;
  count: number;
};

const { users } = defineProps<{
  users: Users[];
}>();

// Chart
const theme = useTheme();
const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Area",
    name: "users" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) => `${round(x, 0, "dollar")}${unit(x)}`,
        minMove: 0.01,
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
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.users) {
    return;
  }

  const newTxsSerie = users
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.count,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.users.setData(newTxsSerie);

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Users"
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="users"
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
