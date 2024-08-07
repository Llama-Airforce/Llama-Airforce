<template>
  <CardChart
    class="tvl"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";
import { type Snapshot } from "@CM/Pages/Convex/Pools/Models/Snapshot";
import { useConvexStore } from "@CM/Pages/Convex/Store";
import { useSettingsStore } from "@CM/Stores";

type Serie = { name: string; data: { x: number; y: number }[] };

const { t } = useI18n();

// Props
interface Props {
  poolSelected: Pool;
}

const { poolSelected } = defineProps<Props>();

// Refs
const store = useConvexStore();

const { theme } = storeToRefs(useSettingsStore());

const snapshots = computed((): Snapshot[] => {
  return poolSelected ? store.snapshots[poolSelected.name] ?? [] : [];
});

const options = computed(() => {
  return createChartStyles(theme.value, {
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

        return `<div><b>${t("tvl")}</b>:</div><div>${formatter(tvl)}</div>`;
      },
    },
  });
});

const series = computed((): Serie[] => {
  return [
    {
      name: "tvl",
      data: snapshots.value.map((s) => ({
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.tvl {
  :deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Total Value Locked
tvl: TVL
</i18n>
