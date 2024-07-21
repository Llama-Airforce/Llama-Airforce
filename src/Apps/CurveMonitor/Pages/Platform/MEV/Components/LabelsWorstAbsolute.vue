<template>
  <CardChart
    class="mevLabels"
    title="Worst absolute offenders"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { type LabelRankingExtended } from "@CM/Services/Sockets/SocketMEV";
import { useQueryGetSandwichLabelOccurrences } from "@CM/Pages/Platform/MEV/Services/Queries";

// Refs
const { data: labelRankingExtended } = useQueryGetSandwichLabelOccurrences();
const { theme } = storeToRefs(useSettingsStore());

const topWorstPerformingLabels = (labelsOccurrence: LabelRankingExtended[]) =>
  labelsOccurrence
    .filter((label) => label.numOfAllTx >= 12) // filter labels with at least 12 numOfAllTx
    .map((label) => ({
      ...label,
      occurrences: label.occurrences,
    }))
    .sort((a, b) => b.occurrences - a.occurrences) // sort in descending order
    .slice(0, 10); // get the top 10

const labels = computed(() =>
  topWorstPerformingLabels(labelRankingExtended.value).map((x) => x.label)
);

const series = computed(() =>
  topWorstPerformingLabels(labelRankingExtended.value).map((x) => x.occurrences)
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
