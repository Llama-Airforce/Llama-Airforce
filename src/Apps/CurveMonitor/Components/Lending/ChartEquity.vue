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
import { chain } from "lodash";
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

// Refs
let equitySerie: ISeriesApi<"Baseline">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    equitySerie = chart.addBaselineSeries(createOptionsSerie());
  }
);

// Watches
watch([toRef(() => equity), chart], createSeries);
watch(theme, () => equitySerie.applyOptions(createOptionsSerie()));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerie(): BaselineSeriesPartialOptions {
  const { colors } = theme.value;

  return {
    priceFormat: {
      type: "custom",
      formatter: (x: number) => formatterPrice(x),
      minMove: 0.01,
    },
    lineWidth: 2,
    baseValue: { type: "price", price: 0 },
    topLineColor: colors.green,
    bottomLineColor: colors.red,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries([newRatios, chart]: [Equity[]?, IChartApi?]): void {
  if (!chart || !equitySerie) {
    return;
  }

  const newEquitySerie: LineData[] = chain(newRatios)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.equity,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newEquitySerie.length > 0) {
    equitySerie.setData(newEquitySerie);
  }

  chart.timeScale().fitContent();
}

const formatterPrice = (x: number): string =>
  `$${round(x, 0, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
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
