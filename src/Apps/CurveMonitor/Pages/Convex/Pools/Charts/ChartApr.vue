<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";
import { type Snapshot } from "@CM/Pages/Convex/Pools/Models/Snapshot";
import { useConvexStore } from "@CM/Pages/Convex/Store";
import { useSettingsStore } from "@CM/Stores";
import { totalApr } from "@CM/Pages/Convex/Pools/Util/SnapshotHelper";

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

const { theme } = storeToRefs(useSettingsStore());

const snapshots = computed(() => {
  return store.snapshots[poolSelected.name] ?? [];
});

const options = computed(() => {
  return createChartStyles(theme.value, {
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

<template>
  <CardChart
    class="apr"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.apr {
  :deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto auto auto;
      grid-template-columns: 1fr auto;
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
