<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
      <div class="actions">
        <Tooltip><span v-html="t('tooltip')"></span></Tooltip>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { type BaselineSeriesPartialOptions } from "lightweight-charts";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

type Equity = {
  timestamp: number;
  equity: number;
};

const { t } = useI18n();

// Props
interface Props {
  equity: Equity[];
}

const { equity } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Baseline",
    name: "equity" as const,
    options: computed((): BaselineSeriesPartialOptions => {
      const { colors } = theme.value;

      return {
        priceFormat: {
          type: "custom",
          formatter: (x: number): string =>
            `$${round(x, 0, "dollar")}${unit(x, "dollar")}`,
          minMove: 0.01,
        },
        lineWidth: 2,
        baseValue: { type: "price", price: 0 },
        topLineColor: colors.green,
        bottomLineColor: colors.red,
        lastValueVisible: false,
        priceLineVisible: false,
      };
    }),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.equity) {
    return;
  }

  const newEquitySerie: LineData[] = equity
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.equity,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newEquitySerie.length > 0) {
    series.equity.setData(newEquitySerie);
  }

  chart.value.timeScale().fitContent();
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
title: Equity
tooltip:
  This chart shows the difference between the value of the collateral and the debt.<br /><br />
  Positive values indicate net equity (collateral exceeds debt),<br />
  while negative values indicate a deficit (debt exceeds collateral, also known as bad debt).
</i18n>
