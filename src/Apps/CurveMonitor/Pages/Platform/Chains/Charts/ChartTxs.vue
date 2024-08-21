<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import { BtnChartLWFullscreen } from "@CM/Components/";
import createChartStyles from "@CM/Util/ChartStyles";

type Transactions = {
  timestamp: number;
  count: number;
};

// Props
interface Props {
  txs: Transactions[];
}

const { txs } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const fullscreen = ref(false);
const chartCard = ref<ComponentPublicInstance | undefined>(undefined);

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Area",
    name: "txs" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "custom",
          formatter: (x: number): string =>
            `${round(x, 0, "dollar")}${unit(x, "dollar")}`,
          minMove: 0.01,
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
function createSeries(): void {
  if (!chart.value || !series.txs) {
    return;
  }

  const newTxsSerie: LineData[] = txs
    .map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.count,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.txs.setData(newTxsSerie);

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="chartCard"
    class="chart-card"
    title="Transactions"
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
