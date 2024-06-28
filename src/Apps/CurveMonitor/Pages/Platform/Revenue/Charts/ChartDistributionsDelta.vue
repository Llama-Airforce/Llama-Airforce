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
import { type Distribution } from "@CM/Services/Revenue";

const { t } = useI18n();

// Props
interface Props {
  distributions: Distribution[];
}

const { distributions } = defineProps<Props>();

// Refs
let distributionsSerie: ISeriesApi<"Histogram">;

const { theme } = storeToRefs(useSettingsStore());

// Chart
const fullscreen = ref(false);
const chartCard = ref<ComponentPublicInstance | undefined>(undefined);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    distributionsSerie = chart.addHistogramSeries(
      createOptionsSerieDistributions()
    );
  }
);

watch([toRef(() => distributions), chart], createSeriesDistributions);
watch(theme, () =>
  distributionsSerie.applyOptions(createOptionsSerieDistributions())
);

function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    rightPriceScale: {
      scaleMargins: {
        top: 0.15,
        bottom: 0.1,
      },
    },
  });
}

function createOptionsSerieDistributions(): HistogramSeriesPartialOptions {
  return {
    priceFormat: {
      type: "custom",
      formatter: (x: number) => formatterPrice(x),
      minMove: 0.01,
    },
    color: theme.value.colors.blue,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeriesDistributions([newDistributions, chart]: [
  Distribution[]?,
  IChartApi?
]): void {
  if (!chart || !distributionsSerie) {
    return;
  }

  const { colors } = theme.value;

  const newDistributionsSeries: HistogramData[] = chain(newDistributions)
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.feesUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .takeRight(53) // Take 53 weeks to calculate 52 deltas
    .reduce((acc, curr, index, array) => {
      if (index === 0) return acc;

      const value = curr.value - array[index - 1].value;
      const color = value < 0 ? colors.red : colors.green;

      acc.push({
        time: curr.time,
        value,
        color,
      });
      return acc;
    }, [] as HistogramData[])
    .value();

  if (newDistributionsSeries.length > 0) {
    distributionsSerie.setData(newDistributionsSeries);

    const from = newDistributionsSeries[0].time;
    const to = newDistributionsSeries[newDistributionsSeries.length - 1].time;
    chart.timeScale().setVisibleRange({ from, to });
  }
}

const formatterPrice = (x: number): string =>
  `$${round(x, 0, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-card {
  ::v-deep(.card-body) {
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
title: Distributions Change (1y)
</i18n>
