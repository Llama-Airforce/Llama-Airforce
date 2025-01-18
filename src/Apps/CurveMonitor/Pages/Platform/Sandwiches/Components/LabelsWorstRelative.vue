<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useQueryLabels } from "@CM/Services/monitor/mev/queries";

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
  return createChartStyles({
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

<template>
  <Card
    title="Worst relative offenders"
    :loading
  >
    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>
