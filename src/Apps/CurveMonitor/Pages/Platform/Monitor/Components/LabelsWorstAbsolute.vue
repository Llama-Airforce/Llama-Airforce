<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useQueryLabels } from "@CM/Services/Monitor/MEV/Queries";

const { data: labelsRaw, isFetching: loading } = useQueryLabels();

const topWorstPerformingLabels = (labels: typeof labelsRaw.value) =>
  (labels ?? [])
    .filter((label) => label.numOfAllTx >= 12) // filter labels with at least 12 numOfAllTx
    .map((label) => ({
      ...label,
      occurrences: label.occurrences,
    }))
    .sort((a, b) => b.occurrences - a.occurrences) // sort in descending order
    .slice(0, 10); // get the top 10

const labels = computed(() =>
  topWorstPerformingLabels(labelsRaw.value).map((x) => x.label)
);

const series = computed(() =>
  topWorstPerformingLabels(labelsRaw.value).map((x) => x.occurrences)
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
          `<div><b>${chain}</b>:</div><div>Occurences: ${formatter(
            revenue
          )}</div>`,
        ];

        return data.join("");
      },
    },
    labels: labels.value,
  });
});

// Methods
const formatter = (x: number): string => `${x}`;
</script>

<template>
  <Card
    title="Worst absolute offenders"
    :loading
  >
    <ChartApex
      :options
      :series
    ></ChartApex>
  </Card>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>
