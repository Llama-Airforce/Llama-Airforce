<template>
  <CardGraph
    class="bribes"
    title="Rewards"
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
import { round, unit } from "@/Util/NumberHelper";
import type { Epoch } from "@/Pages/Bribes/Models/Epoch";
import type { Bribe } from "@/Pages/Bribes/Models/Bribe";
import { useBribesStore } from "@/Pages/Bribes/Store";
import { chain } from "lodash";
import type { DataPoint } from "@/Util/DataPoint";
import type { Product } from "@/Pages/Bribes/Models/Product";

type Serie = { name: string; data: number[] };

// Refs
const store = useBribesStore();

const epoch = $computed((): Epoch | null => {
  return store.selectedEpoch;
});

const product = $computed((): Product | null => {
  const platform = store.selectedPlatform;
  const protocol = store.selectedProtocol;

  if (!platform || !protocol) return null;

  return {
    platform,
    protocol,
  };
});

const bribes = $computed((): Bribe[] => {
  if (!epoch || !product) {
    return [];
  }

  const { platform, protocol } = product;
  const stinkBid = protocol === "aura-bal" ? 0 : 2500;

  return (
    (
      store.epochs[platform][protocol].find((epoch) => epoch === epoch)
        ?.bribes ?? []
    )
      // Filter stink bids.
      .filter((bribe) => bribe.amountDollars > stinkBid)
  );
});

const categories = $computed((): string[] => {
  type Pool = { pool: string; amountDollars: number };

  return chain(bribes)
    .groupBy((bribe) => bribe.pool)
    .map((bribes) =>
      bribes.reduce(
        (acc, bribe) => ({
          pool: acc.pool,
          amountDollars: acc.amountDollars + bribe.amountDollars,
        }),
        { pool: bribes[0].pool, amountDollars: 0 }
      )
    )
    .orderBy((x: Pool) => x.amountDollars, "desc")
    .map((x) => x.pool)
    .value();
});

// eslint-disable-next-line max-lines-per-function
const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "votium-bribe-round",
      type: "bar",
      stacked: true,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: {
        formatter: (y: number): string =>
          `$${round(y, 2, "dollar")}${unit(y, "dollar")}`,
      },
    },
    plotOptions: {
      bar: {
        columnWidth:
          optimalColumnWidthPercent(categories.length).toString() + "%",
        distributed: true,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: false,
      custom: (x: DataPoint<Serie>) => {
        const data = chain(x.w.globals.initialSeries)
          .map((token) => {
            return {
              token: token.name,
              sum: token.data[x.dataPointIndex],
            };
          })
          .filter((x) => x.sum > 0)
          .map((x) => ({
            token: x.token,
            sum: `$${round(x.sum, 2, "dollar")}${unit(x.sum, "dollar")}`,
          }))
          .orderBy((x) => x.sum, "desc")
          .map((x) => `<div><b>${x.token}</b>:</div><div>${x.sum}</div>`)
          .value();

        return data.join("");
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (_value: number, x: DataPoint<Serie>) => {
        if (x.seriesIndex === x.w.config.series.length - 1) {
          const sum = x.w.globals.stackedSeriesTotals[x.dataPointIndex];
          return `$${round(sum, 2, "dollar")}${unit(sum, "dollar")}`;
        }
        return "";
      },
      offsetY: -25,
      style: {
        fontSize: "12px",
        fontFamily: "SF Mono, Consolas, monospace",
      },
    },
  });
});

const series = $computed((): Serie[] => {
  return (
    chain(bribes)
      // Create a series per token paid.
      .groupBy((bribe) => bribe.token)
      .map((bribes, token) => ({
        name: token,
        // For each pool we will aggregate the bribes for that pool.
        data: categories.map((pool) =>
          bribes.reduce(
            (acc, bribe) =>
              bribe.pool === pool ? acc + bribe.amountDollars : acc,
            0
          )
        ),
      }))
      .value()
  );
});

// Methods
const optimalColumnWidthPercent = (numBars: number): number => {
  return 20 + 60 / (1 + 30 * Math.exp(-numBars / 3));
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.bribes {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;

    .apexcharts-tooltip {
      width: auto;
      background: rgb(30, 30, 30);
      padding: 1rem;
      line-height: 0.5rem;

      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
    }
  }
}
</style>
