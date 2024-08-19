<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

type CollateralRatio = {
  timestamp: number;
  ratio: number;
};

const { t } = useI18n();

// Props
interface Props {
  ratios: CollateralRatio[];
}

const { ratios } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Area",
    name: "ratios" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number): string =>
            `${round(x, 0, "percentage")}${unit(x, "percentage")}`,
          minMove: 0.1,
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

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.ratios) {
    return;
  }

  const newSerie: LineData[] = ratios
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.ratio * 100,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.ratios.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

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
title: Collateral Ratio
</i18n>
