<template>
  <CardGraph
    class="mevLabels"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import { useMEVStore } from "@CM/Pages/Pool/MEV/Store";
import { type LabelRankingExtended } from "@CM/Services/Sockets/SocketMEV";

// Refs
const store = useMEVStore();
const storeSettings = useSettingsStore();

const labels = computed((): LabelRankingExtended[] =>
  topWorstPerformingLabels(store.labelRankingExtended)
);

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "chainRevenues",
        type: "bar",
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        categories: labels.value.map((x) => x.label),
        labels: {
          formatter,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        style: {
          fontSize: "11px",
        },
        formatter,
        dropShadow: false,
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    }
  );
});

const series = computed((): { data: number[] }[] => [
  { data: topWorstPerformingLabels(labels.value).map((x) => x.ratio) },
]);

const topWorstPerformingLabels = (labelsOccurrence: LabelRankingExtended[]) =>
  labelsOccurrence
    .filter((label) => label.numOfAllTx >= 12) // filter labels with at least 12 numOfAllTx
    .map((label) => ({
      ...label,
      ratio: Number(((label.occurrences / label.numOfAllTx) * 100).toFixed(2)),
    })) // calculate the ratio as a percentage with 2 decimal places
    .sort((a, b) => b.ratio - a.ratio) // sort in descending order
    .slice(0, 10); // get the top 10

// Methods
const formatter = (x: number): string => `${x}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.mevLabels {
  height: 400px;

  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
