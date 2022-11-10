<template>
  <CardGraph
    class="tvl"
    title="Total Value Locked"
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
import Pool from "@/Pages/Convex/Pools/Models/Pool";
import Snapshot from "@/Pages/Convex/Pools/Models/Snapshot";
import { round, unit } from "@/Util/NumberHelper";
import { useConvexStore } from "@/Pages/Convex/Store";
import type { DataPoint } from "@/Util/DataPoint";

type Serie = { name: string; data: { x: number; y: number }[] };

// Props
interface Props {
  poolSelected: Pool;
}

const { poolSelected } = defineProps<Props>();

// Refs
const store = useConvexStore();

const snapshots = $computed((): Snapshot[] => {
  return poolSelected ? store.snapshots[poolSelected.name] ?? [] : [];
});

const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "convex-tvl",
      type: "area",
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: (y: number): string => formatter(y),
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: false,
      custom: (x: DataPoint<Serie>) => {
        const tvl =
          x.w.globals.initialSeries[x.seriesIndex].data[x.dataPointIndex].y;

        return `<div><b>TVL</b>:</div><div>${formatter(tvl)}</div>`;
      },
    },
  });
});

const series = $computed((): Serie[] => {
  return [
    {
      name: "tvl",
      data: snapshots.map((s) => ({
        x: s.timeStamp * 1000,
        y: s.tvl,
      })),
    },
  ];
});

// Methods
const formatter = (y: number): string => {
  return `$${round(y, 1, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.tvl {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      background: rgb(30, 30, 30);
      padding: 1rem;
      line-height: 0.5rem;

      display: grid;
      grid-template-rows: auto;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
  }
}
</style>
