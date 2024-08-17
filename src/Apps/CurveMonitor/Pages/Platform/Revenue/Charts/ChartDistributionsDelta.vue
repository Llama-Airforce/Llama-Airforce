<template>
  <Card
    ref="chartCard"
    class="chart-card"
    :title="t('title')"
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

// Chart
const { theme } = storeToRefs(useSettingsStore());

const fullscreen = ref(false);
const chartCard = ref<ComponentPublicInstance | undefined>(undefined);

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Histogram",
    name: "deltas" as const,
    options: computed(
      (): HistogramSeriesPartialOptions => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number): string =>
            `$${round(x, 0, "dollar")}${unit(x, "dollar")}`,
          minMove: 0.01,
        },
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })
    ),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.deltas) {
    return;
  }

  const { colors } = theme.value;

  const newDistributionsSeries: HistogramData[] = distributions
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.feesUsd,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .takeRight(53) // Take 53 weeks to calculate 52 deltas
    .reduce<HistogramData[]>((acc, curr, index, array) => {
      if (index === 0) return acc;

      const value = curr.value - array[index - 1].value;
      const color = value < 0 ? colors.red : colors.green;

      acc.push({
        time: curr.time,
        value,
        color,
      });
      return acc;
    }, []);

  if (newDistributionsSeries.length > 0) {
    series.deltas.setData(newDistributionsSeries);

    const from = newDistributionsSeries[0].time;
    const to = newDistributionsSeries[newDistributionsSeries.length - 1].time;
    chart.value.timeScale().setVisibleRange({ from, to });
  }
}
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
title: Distributions Change (1y)
</i18n>
