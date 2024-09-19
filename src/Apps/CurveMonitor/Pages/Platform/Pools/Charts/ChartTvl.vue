<script setup lang="ts">
import { BtnChartLWExport, BtnChartLWFullscreen } from "@CM/Components/";
import createChartOptions from "@CM/Util/ChartStyles";

type Tvl = {
  timestamp: number;
  tvl: number;
};

const { tvl } = defineProps<{
  tvl: Tvl[];
}>();

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Area",
    name: "tvl" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) =>
          `$${round(y, 1, "dollar")}${unit(y, "dollar")}`,
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
  if (!chart.value || !series.tvl) {
    return;
  }

  const newSerie = tvl
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.tvl,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.tvl.setData(newSerie);
  }

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
