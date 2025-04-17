<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQueryWeightHistory } from "@CM/queries/gauge";

const { gaugeAddress } = defineProps<{
  gaugeAddress: string | undefined;
}>();

const { isFetching: loading, data } = useQueryWeightHistory(
  toRef(() => gaugeAddress)
);

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "weight" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => round(y, 1),
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.weight) {
    return;
  }

  const newSerie = data.value
    .map((x) => ({
      time: x.epoch as UTCTimestamp,
      value: Number(x.weight) / 10 ** 18,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.weight.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Weight"
    :loading
  >
    <template #actions>
      <div style="display: flex">
        <BtnChartLWExport
          filename="weight"
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
