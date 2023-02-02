<template>
  <CardGraph
    class="balances"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { CardGraph } from "@/Framework";
import { round, unit, type DataPoint } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import type { Reserves } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";

const { t } = useI18n();

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// Refs
const store = useCurveMonitorStore();

const reserves = $computed((): Reserves[] => {
  return store.reserves;
});

const numCoins = $computed((): number => {
  return store.reserves[0]?.reservesUSD?.length ?? 0;
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
          (p, i) => `<div><b>0x${i}</b>:</div><div>${formatter(p)}</div>`
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
const createAxisY = (i: number): unknown => {
  return {
    seriesName: `0x${i}`,
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
    name: `0x${i}`,
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

<style lang="scss" scoped>
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

<i18n lang="yaml" locale="en">
title: Balances
</i18n>
