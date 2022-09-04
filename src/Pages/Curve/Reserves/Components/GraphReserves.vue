<template>
  <CardGraph
    class="reserves"
    :title="title"
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
import Pool from "@/Pages/Curve/Models/Pool";
import Reserves from "@/Pages/Curve/Reserves/Models/Reserves";
import { round, unit } from "@/Util/NumberHelper";
import { useCurveStore } from "@/Pages/Curve/Store";
import { shorten } from "@/Util/PoolHelper";
import { DataPoint } from "@/Util/DataPoint";

type Serie = { name: string; data: { x: number; y: number }[] };

// Props
interface Props {
  poolSelected: Pool | null;
}

const { poolSelected } = defineProps<Props>();

// Refs
const store = useCurveStore();

const title = $computed((): string => {
  let title = "Reserves";
  if (poolSelected) {
    title = shorten(poolSelected.name);
  }

  return title;
});

const reserves = $computed((): Reserves[] => {
  return poolSelected ? store.reserves[poolSelected.id] ?? [] : [];
});

const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "reserves",
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
      name: "reserves",
      data: reserves.map((r) => ({
        x: r.timestamp * 1000,
        y: r.reservesUSD.reduce((acc, x) => acc + x, 0),
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

.reserves {
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
