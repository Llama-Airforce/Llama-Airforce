<template>
  <CardGraph
    class="apr"
    title="Annual Percentage Rate"
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
import createAnnotations from "@/Pages/Convex/Pools/Models/Annotations";
import { round, unit } from "@/Util/NumberHelper";
import { useConvexStore } from "@/Pages/Convex/Store";
import { startDate, totalApr } from "@/Pages/Convex/Pools/Util/SnapshotHelper";
import type { DataPoint } from "@/Util/DataPoint";

type Serie = {
  name: string;
  data: { x: number; y: number; snapshot: Snapshot }[];
};

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
      id: "convex-apr",
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
        const snapshot =
          x.w.globals.initialSeries[x.seriesIndex].data[x.dataPointIndex]
            .snapshot;

        const data = [
          `<div><b>Base</b>:</div><div>${formatter(snapshot.baseApr)}</div>`,
          `<div><b>CRV</b>:</div><div>${formatter(snapshot.crvApr)}</div>`,
          `<div><b>CVX</b>:</div><div>${formatter(snapshot.cvxApr)}</div>`,
          `<div><b>Extra</b>:</div><div>${formatter(
            snapshot.extraRewardsApr
          )}</div>`,
        ];

        return data.join("");
      },
    },
    ...createAnnotations(startDate(snapshots)),
  });
});

const series = $computed((): Serie[] => {
  return [
    {
      name: "APR",
      data: snapshots.map((s) => ({
        x: s.timeStamp * 1000,
        y: totalApr(s),
        snapshot: s,
      })),
    },
  ];
});

// Methods
const formatter = (y: number): string => {
  y *= 100;
  return `${round(y, 1, "percentage")}${unit(y, "percentage")}`;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.apr {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      background: rgb(30, 30, 30);
      padding: 1rem;
      line-height: 0.5rem;

      display: grid;
      grid-template-rows: auto auto auto auto;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
  }
}
</style>
