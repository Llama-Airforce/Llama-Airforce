<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type CrvUsdSupply } from "@CM/Services/CrvUsd";

const { data = [] } = defineProps<{
  data: CrvUsdSupply[];
}>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, series } = useLightweightChart({
  createChartOptions: (chartRef) =>
    computed(() => createChartStyles(chartRef, theme.value)),
  series: [
    {
      type: "Area",
      name: "supply" as const,
      options: computed(
        (): AreaSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
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
    {
      type: "Line",
      name: "debt" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "custom",
            formatter,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          color: theme.value.colors.yellow,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.debt || !series.supply) {
    return;
  }

  const newSupplySerie: (LineData & { debt: number })[] = data
    .groupBy((x) => x.timestamp)
    .entries()
    .map(([, x]) => ({
      time: x[0].timestamp as UTCTimestamp,
      value: x.reduce((acc, y) => acc + y.supply, 0),
      debt: x.find((y) => y.market === "Keepers debt")?.supply ?? 0,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  const newDebtSerie: LineData[] = newSupplySerie.map((x) => ({
    time: x.time,
    value: x.value - x.debt,
  }));

  if (newSupplySerie.length > 0) {
    series.supply.setData(newSupplySerie);
  }

  if (newDebtSerie.length > 0) {
    series.debt.setData(newDebtSerie);
  }

  chart.value.timeScale().fitContent();
}

function formatter(y: number): string {
  return `${round(y, 0, "dollar")}${unit(y, "dollar")}`;
}
</script>

<template>
  <div
    ref="chartRef"
    class="chart"
  ></div>
</template>
