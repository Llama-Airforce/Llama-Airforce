<template>
  <CardGraph
    class="graph"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { chain } from "lodash";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import { useSettingsStore } from "@CM/Stores/SettingsStore";
import { type BreakdownRevenueV2 } from "@CM/Pages/Platform/Revenue/Services/RevenueService";
import { useCurveStore } from "@CM/Pages/Platform/Store";

type Serie = {
  name: string;
  data: { x: string; y: number }[];
};

// Refs
const store = useCurveStore();
const storeSettings = useSettingsStore();

const breakdown = computed((): BreakdownRevenueV2[] => {
  return store.breakdown ?? [];
});

// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        type: "bar",
        stacked: true,
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: formatterX,
          rotate: 0,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          formatter: formatterY,
        },
        min: 0,
        max: max.value,
      },
      plotOptions: {
        bar: {
          columnWidth: "75%",
          dataLabels: {
            position: "top",
            hideOverflowingLabels: false,
          },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
      },
    }
  );
});

// Take the N latest weeks.
const weeks = computed((): number[] =>
  chain(breakdown.value)
    .groupBy((x) => x.week)
    .map((breakdowns) => ({
      week: breakdowns[0].week,
      numLabels: breakdowns.length,
    }))
    .orderBy((x) => x.week, "asc")
    // We want to start at the first occurance of crvUSD.
    .dropWhile((x) => x.numLabels < 3)
    .map((x) => x.week)
    .value()
);

const categories = computed((): string[] =>
  chain(weeks.value)
    .map((week) =>
      new Date(week * 1000).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .value()
);

const series = computed((): Serie[] =>
  chain(breakdown.value)
    .groupBy((x) => x.label)
    .map((breakdown, origin) => ({
      name: origin,
      // For each week, find the corresponding data if available, else zero.
      data: chain(weeks.value)
        .map((week) => ({
          week,
          breakdown: breakdown.find((x) => x.week === week),
        }))
        .map((x) => ({
          x: new Date(x.week * 1000).toLocaleDateString(),
          y: x.breakdown?.total_fees ?? 0,
        }))
        .value(),
    }))
    .value()
);

const max = computed(() => {
  let max = 0;

  // For each week, sum all serie data.
  for (let i = 0; i < weeks.value.length; i++) {
    max = Math.max(
      max,
      series.value
        .map((serie) => serie.data[i].y)
        .reduce((acc, y) => acc + y, 0)
    );
  }

  return max * 1.1;
});

const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      line-height: 0.25rem;
    }
  }
}
</style>
