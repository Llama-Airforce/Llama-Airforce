<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

type Tvl = {
  timestamp: number;
  tvl: number;
};

const { t } = useI18n();

// Props
interface Props {
  tvl: Tvl[];
}

const { tvl } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      height: 300,
    }),
  series: {
    type: "Area",
    name: "tvl" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number): string =>
            `$${round(y, 1, "dollar")}${unit(y, "dollar")}`,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        lineColor: theme.value.colors.blue,
        topColor: "rgb(32, 129, 240, 0.2)",
        bottomColor: "rgba(32, 129, 240, 0)",
        lastValueVisible: false,
        priceLineVisible: false,
      })
    ),
  },
});

watch([toRef(() => tvl), chart], createSeries);
function createSeries([newOHLC, chart]: [Tvl[]?, IChartApi?]): void {
  if (!chart || !series.tvl) {
    return;
  }

  const newSerie: LineData[] = chain_(newOHLC)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.tvl,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    series.tvl.setData(newSerie);
  }

  chart.timeScale().fitContent();
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: TVL
</i18n>
