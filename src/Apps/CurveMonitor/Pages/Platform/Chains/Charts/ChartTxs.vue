<template>
  <Card
    ref="chartCard"
    class="chart-card"
    :title="t('title')"
    :class="{ fullscreen }"
  >
    <template #actions>
      <div class="actions">
        <BtnChartLWFullscreen
          v-model="fullscreen"
          :chart="chart"
          :target="chartCard?.$el"
        />
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
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWFullscreen } from "@CM/Components/";
import createChartStyles from "@CM/Util/ChartStyles";

type Transactions = {
  timestamp: number;
  count: number;
};

const { t } = useI18n();

// Props
interface Props {
  txs: Transactions[];
}

const { txs } = defineProps<Props>();

// Refs
let txsSerie: ISeriesApi<"Area"> | undefined;

const { theme } = storeToRefs(useSettingsStore());

// Chart
const fullscreen = ref(false);
const chartCard = ref<ComponentPublicInstance | undefined>(undefined);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    txsSerie = chart.addAreaSeries(createOptionsSerieTxs());
  }
);

watch(theme, () => {
  txsSerie?.applyOptions(createOptionsSerieTxs());
});

function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: chartRef.clientHeight || 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerieTxs(): AreaSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter: (x: number) => formatterPrice(x),
      minMove: 0.01,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    lineColor: theme.value.colors.blue,
    topColor: "rgb(32, 129, 240, 0.2)",
    bottomColor: "rgba(32, 129, 240, 0)",
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

watchEffect(createSeries);
function createSeries(): void {
  if (!chart.value || !txsSerie) {
    return;
  }

  const newTxsSerie: LineData[] = chain(txs)
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.count,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  txsSerie.setData(newTxsSerie);

  chart.value.timeScale().fitContent();
}

const formatterPrice = (x: number): string =>
  `${round(x, 0, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-card {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Transactions
</i18n>
