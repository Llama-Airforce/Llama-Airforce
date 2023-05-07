<template>
  <CardGraph
    class="chain-top=pools"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardGraph } from "@/Framework";
import { round, unit } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import { ChainTopPoolRevenue } from "@LAF/Pages/Curve/Revenue/Models/Revenue";
import { useCurveStore } from "@LAF/Pages/Curve/Store";

// Props
interface Props {
  chainSelected: string | null;
}

const { chainSelected } = defineProps<Props>();

// Refs
const store = useCurveStore();

const topPools = computed((): ChainTopPoolRevenue[] => {
  return chainSelected ? store.topPools[chainSelected] ?? [] : [];
});

const options = computed((): unknown => {
  return createChartStylesLAF({
    legend: {
      inverseOrder: true,
    },
    fill: {
      type: "solid",
      opacity: 0.9,
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
      formatter: dollarFormatter,
      dropShadow: false,
    },
    grid: {
      strokeDashArray: 2,
    },
    tooltip: {
      enabled: false,
    },
    chart: {
      id: "chainRevenues",
      type: "bar",
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      categories: topPools.value.map((x) => x.name),
      labels: {
        formatter: dollarFormatter,
      },
    },
  });
});

const series = computed((): { data: number[] }[] => {
  return [{ data: topPools.value.map((x) => x.totalDailyFeesUSD) }];
});

// Methods
const dollarFormatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.pool-revenue {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      padding: 0.5rem;
      line-height: 0rem;

      display: grid;
      grid-template-rows: auto auto;
      gap: 0.5rem;
    }
  }
}
</style>
