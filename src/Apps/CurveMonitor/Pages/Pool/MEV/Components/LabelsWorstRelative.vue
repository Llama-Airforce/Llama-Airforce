<template>
  <CardGraph
    class="mevLabels"
    title="Worst relative offenders"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { CardGraph } from "@/Framework";
import { type DataPoint } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores";
import { useMEVStore } from "@CM/Pages/Pool/MEV/Store";
import { type LabelRankingExtended } from "@CM/Services/Sockets/SocketMEV";

// Refs
const store = useMEVStore();
const storeSettings = useSettingsStore();

const topWorstPerformingLabels = (labelsOccurrence: LabelRankingExtended[]) =>
  labelsOccurrence
    .filter((label) => label.numOfAllTx >= 12) // filter labels with at least 12 numOfAllTx
    .map((label) => ({
      ...label,
      ratio: Number(((label.occurrences / label.numOfAllTx) * 100).toFixed(2)),
    })) // calculate the ratio as a percentage with 2 decimal places
    .sort((a, b) => b.ratio - a.ratio) // sort in descending order
    .slice(0, 10); // get the top 10

const labels = computed(() =>
  topWorstPerformingLabels(store.labelRankingExtended).map((x) => x.label)
);

const series = computed(() =>
  topWorstPerformingLabels(store.labelRankingExtended).map((x) => x.ratio)
);

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
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
            `<div><b>${chain}</b>:</div><div>Ratio: ${formatter(
              revenue
            )}</div>`,
          ];

          return data.join("");
        },
      },
      labels: labels.value,
    }
  );
});

// Methods
const formatter = (x: number): string => `${x}%`;
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
