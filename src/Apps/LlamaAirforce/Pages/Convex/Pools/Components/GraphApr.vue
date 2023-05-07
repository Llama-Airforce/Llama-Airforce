<template>
  <CardGraph
    class="apr"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph } from "@/Framework";
import { round, unit, type DataPoint } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import Pool from "@LAF/Pages/Convex/Pools/Models/Pool";
import Snapshot from "@LAF/Pages/Convex/Pools/Models/Snapshot";
import { useConvexStore } from "@LAF/Pages/Convex/Store";
import { totalApr } from "@LAF/Pages/Convex/Pools/Util/SnapshotHelper";

type Serie = {
  name: string;
  data: { x: number; y: number; snapshot: Snapshot }[];
};

const { t } = useI18n();

// Props
interface Props {
  poolSelected: Pool;
}

const { poolSelected } = defineProps<Props>();

// Refs
const store = useConvexStore();

const snapshots = computed((): Snapshot[] => {
  return poolSelected ? store.snapshots[poolSelected.name] ?? [] : [];
});

const options = computed((): unknown => {
  return createChartStylesLAF({
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
          `<div><b>${t("base")}</b>:</div><div>${formatter(
            snapshot.baseApr
          )}</div>`,
          `<div><b>${t("crv")}</b>:</div><div>${formatter(
            snapshot.crvApr
          )}</div>`,
          `<div><b>${t("cvx")}</b>:</div><div>${formatter(
            snapshot.cvxApr
          )}</div>`,
          `<div><b>${t("extra")}</b>:</div><div>${formatter(
            snapshot.extraRewardsApr
          )}</div>`,
        ];

        return data.join("");
      },
    },
  });
});

const series = computed((): Serie[] => {
  return [
    {
      name: "APR",
      data: snapshots.value.map((s) => ({
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

<style lang="scss" scoped>
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

<i18n lang="yaml" locale="en">
title: Annual Percentage Rate
base: Base
crv: CRV
cvx: CVX
exta: Extra
</i18n>
