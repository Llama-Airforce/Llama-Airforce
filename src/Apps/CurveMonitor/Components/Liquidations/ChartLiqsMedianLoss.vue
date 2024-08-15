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
import { type LiqLosses } from "@CM/Services/Liquidations";

const { t } = useI18n();

// Props
interface Props {
  losses: LiqLosses[];
}

const { losses } = defineProps<Props>();

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
    name: "losses" as const,
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

watch([toRef(() => losses), chart], createSeries);
function createSeries([newLosses, chart]: [LiqLosses[]?, IChartApi?]): void {
  if (!chart || !series.losses) {
    return;
  }

  const newSerie: LineData[] = chain_(newLosses)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.pctLossMedian,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    series.losses.setData(newSerie);
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
title: Median Loss % Among Loans with Losses
</i18n>
