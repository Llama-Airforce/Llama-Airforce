<template>
  <CardChart
    class="mevLabels"
    title="Worst relative offenders"
    :options
    :series
    :loading
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { useQueryLabels } from "@CM/Services/Monitor/MEV/Queries";

const { theme } = storeToRefs(useSettingsStore());

const { data: labelsRaw, isFetching: loading } = useQueryLabels();

const topWorstPerformingLabels = (labels: typeof labelsRaw.value) =>
  (labels ?? [])
    .filter((label) => label.numOfAllTx >= 12) // filter labels with at least 12 numOfAllTx
    .map((label) => ({
      ...label,
      ratio: Number(((label.occurrences / label.numOfAllTx) * 100).toFixed(2)),
    })) // calculate the ratio as a percentage with 2 decimal places
    .sort((a, b) => b.ratio - a.ratio) // sort in descending order
    .slice(0, 10); // get the top 10

const labels = computed(() =>
  topWorstPerformingLabels(labelsRaw.value).map((x) => x.label)
);

const series = computed(() =>
  topWorstPerformingLabels(labelsRaw.value).map((x) => x.ratio)
);

const options = computed(() => {
  return createChartStyles(theme.value, {
    chart: {
      id: "chainRevenues",
      type: "donut",
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: (x: DataPoint<number>) => {
        const chain = x.w.globals.labels[x.seriesIndex];
        const revenue = x.series[x.seriesIndex] as unknown as number;

        const data = [
          `<div><b>${chain}</b>:</div><div>Ratio: ${formatter(revenue)}</div>`,
        ];

        return data.join("");
      },
    },
    labels: labels.value,
  });
});

// Methods
const formatter = (x: number): string => `${x}%`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.mevLabels {
  height: 400px;

  :deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
