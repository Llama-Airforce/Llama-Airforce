<template>
  <CardGraph
    class="graph"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { type ChainRevenue } from "@CM/Pages/Platform/Revenue/Services/RevenueService";
import { useCurveStore } from "@CM/Pages/Platform/Store";
import { useSettingsStore } from "@CM/Stores";

// Refs
const store = useCurveStore();
const storeSettings = useSettingsStore();

const chainRevenues = computed((): ChainRevenue[] => {
  return orderBy(store.chainRevenues ?? [], (x) => x.totalDailyFeesUSD, "asc");
});

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
      legend: {
        inverseOrder: true,
      },
      stroke: {
        width: 0.5,
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
          const revenue = x.series[x.seriesIndex][0];

          const data = [
            `<div><b>${chain}</b>:</div><div>${formatter(revenue)}</div>`,
          ];

          return data.join("");
        },
      },
      labels: chainRevenues.value.map((x) => x.chain),
    }
  );
});

const series = computed(() =>
  chainRevenues.value.map((x) => x.totalDailyFeesUSD)
);

// Methods
const formatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>
