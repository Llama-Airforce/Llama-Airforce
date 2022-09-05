<template>
    <CardGraph
      class="chain-top=pools"
      :options="options"
      :series="series"
    >
    </CardGraph>
</template>

<script
  setup
  lang="ts"
>
import { $computed } from "vue/macros";
import CardGraph from "@/Framework/CardGraph.vue";
import createChartStyles from "@/Styles/ChartStyles";
import { ChainRevenue } from "@/Pages/Curve/Revenue/Models/Revenue";
import { round, unit } from "@/Util/NumberHelper";
import { useCurveStore } from "@/Pages/Curve/Store";

// Refs
const store = useCurveStore();

const chainRevenues = $computed((): ChainRevenue[] => {
  return store.chainRevenues ?? [];
});

const options = $computed((): unknown => {
  return createChartStyles({
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
        fontSize: "12px",
      },
      formatter: dollarFormatter,
      dropShadow: false,
    },
    tooltip: {
      enabled: false
    },
    chart: {
      id: "chainRevenues",
      type: "bar",
      animations: {
        enabled: false,
      },
    },
    xaxis:{
      categories: chainRevenues.map((x) => x.chain),
      labels: {
        formatter: dollarFormatter
      }
    },
  });
});

const series = [{data: chainRevenues.map((x) => x.totalDailyFeesUSD)}];

// Methods

const dollarFormatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style
  lang="scss"
  scoped
>
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
