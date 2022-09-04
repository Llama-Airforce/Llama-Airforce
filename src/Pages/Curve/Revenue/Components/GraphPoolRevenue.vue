<template>
  <CardGraph
    class="pool-revenue"
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
import PoolRevenue from "@/Pages/Curve/Revenue/Models/Revenue";
import { round, unit } from "@/Util/NumberHelper";
import { useCurveStore } from "@/Pages/Curve/Store";

type Serie = {
  name: string;
  data: { x: number; y: number }[];
};


// Refs
const store = useCurveStore();

const poolRevenues = $computed((): PoolRevenue[] => {
  return store.poolRevenues ?? [];
});

const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "poolRevenues",
      type: "area",
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: [{
      seriesName: "volume",
      tickAmount: 4,
      labels: {
        formatter: (y: number): string => formatter(y),
      },
      min: 0,
      max: series.map((x) => Math.max(...x.data.map((x) => x.y))).reduce((acc, rev) => acc + rev, 0),
    }],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        distributed: false,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
  });
});


const series = $computed((): Serie[] => {
  const data = poolRevenues.reduce((acc: {[key: string]: { x: number, y: number }[]}, elem) => {
    const {pool, timestamp, revenue } = elem;
    return {...acc, [pool]: [...(acc[pool] || []), {'x': timestamp * 1000, 'y': revenue}]};}, {});
  return Object.entries(data).map((x) => ({
    name: x[0],
    data: x[1]}));
});

// Methods

const formatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.balances {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      background: rgb(30, 30, 30);
      padding: 1rem;
      line-height: 0.5rem;

      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
  }
}
</style>
