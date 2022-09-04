<template>
  <CardGraph
    class="balances"
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
import { DataPoint } from "@/Util/DataPoint";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// Props
interface Props {
  poolSelected: Pool | null;
}

const { poolSelected } = defineProps<Props>();

// Refs
const store = useCurveStore();

const reserves = $computed((): Reserves[] => {
  return poolSelected ? store.reserves[poolSelected.id] ?? [] : [];
});

const numCoins = $computed((): number => {
  return poolSelected
    ? store.reserves[poolSelected.id]?.[0]?.reservesUSD?.length
    : 0;
});

const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "balances",
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: [...Array(numCoins).keys()].map((i) => createAxisY(i)),
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
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: false,
      custom: (x: DataPoint<Serie>) => {
        const percentages = [...Array(numCoins).keys()].map(
          (i) => x.w.globals.initialSeries[i].data[x.dataPointIndex].y
        );

        const data = percentages.map(
          (p, i) =>
            `<div><b>${address(i).substring(0, 10)}</b>:</div><div>${formatter(
              p
            )}</div>`
        );

        return data.join("");
      },
    },
  });
});

const series = $computed((): Serie[] => {
  return [...Array(numCoins).keys()].map((i) => createSerie(i));
});

// Methods
const address = (i: number): string => {
  return poolSelected?.coins?.[i] ?? "0x?";
};

const createAxisY = (i: number): unknown => {
  return {
    seriesName: address(i),
    tickAmount: 4,
    labels: {
      formatter: (y: number): string => formatter(y),
    },
    min: 0,
    max: 100,
    show: i === 0,
  };
};

const createSerie = (i: number): Serie => {
  return {
    name: address(i),
    type: "line",
    data: reserves.map((r) => ({
      x: r.timestamp * 1000,
      y:
        (r.reservesUSD[i] / r.reservesUSD.reduce((acc, x) => acc + x, 0)) * 100,
    })),
  };
};

const formatter = (y: number): string => {
  return `${round(y, 2, "percentage")}${unit(y, "percentage")}`;
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
