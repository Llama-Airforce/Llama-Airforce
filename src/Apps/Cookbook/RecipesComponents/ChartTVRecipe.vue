<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import Recipe from "@CB/Recipe.vue";

type Tvl = {
  timestamp: number;
  tvl: number;
};

const tvl = ref<Tvl[]>([
  { timestamp: 1672531200, tvl: 1000000 },
  { timestamp: 1675209600, tvl: 1200000 },
  { timestamp: 1677628800, tvl: 900000 },
  { timestamp: 1680307200, tvl: 1500000 },
  { timestamp: 1682899200, tvl: 1800000 },
  { timestamp: 1685577600, tvl: 2100000 },
  { timestamp: 1688169600, tvl: 1950000 },
  { timestamp: 1690848000, tvl: 2300000 },
]);

// Chart
const theme = useTheme();

const cardLine = useTemplateRef("cardLine");
const chartRefLine: TemplateRef = useTemplateRef("chartRefLine");
const { chart: chartLine, series: seriesLine } = useLightweightChart({
  createChartOptions: createChartOptions(),
  chartRef: chartRefLine,
  series: {
    type: "Area",
    name: "tvl" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
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

const cardBar = useTemplateRef("cardBar");
const chartRefBar: TemplateRef = useTemplateRef("chartRefBar");
const { chart: chartBar, series: seriesBar } = useLightweightChart({
  createChartOptions: createChartOptions(),
  chartRef: chartRefBar,
  series: {
    type: "Histogram",
    name: "tvl" as const,
    options: computed<HistogramSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
      },
      color: theme.value.colors.yellow,
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (
    !chartLine.value ||
    !chartBar.value ||
    !seriesLine.tvl ||
    !seriesBar.tvl
  ) {
    return;
  }

  const newSerie = tvl.value
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.tvl,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    seriesLine.tvl.setData(newSerie);
    seriesBar.tvl.setData(newSerie);
  }

  chartLine.value.timeScale().fitContent();
  chartBar.value.timeScale().fitContent();
}
</script>

<template>
  <div class="dashboard">
    <Recipe title="Line Chart">
      <template #example>
        <Card
          ref="cardLine"
          title="TVL"
        >
          <template #actions>
            <div style="display: flex">
              <BtnChartLWExport
                filename="tvl"
                :series="seriesLine"
              />

              <BtnChartLWFullscreen
                :chart="chartLine"
                :target="cardLine"
              />
            </div>
          </template>

          <div
            ref="chartRefLine"
            class="chartLine"
          ></div>
        </Card>
      </template>
    </Recipe>

    <Recipe title="Bar Chart">
      <template #example>
        <Card
          ref="cardBar"
          title="TVL"
        >
          <template #actions>
            <div style="display: flex">
              <BtnChartLWExport
                filename="tvl"
                :series="seriesBar"
              />

              <BtnChartLWFullscreen
                :chart="chartBar"
                :target="cardBar"
              />
            </div>
          </template>

          <div
            ref="chartRefBar"
            class="chartBar"
          ></div>
        </Card>
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr;
}

.chartLine,
.chartBar {
  height: 500px;
}
</style>
