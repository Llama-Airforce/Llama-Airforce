<template>
  <CardGraph
    class="reserves"
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
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import type { Pool, Reserves } from "@CM/Pages/Platform/Pools/Models";
import { useCurvePoolsStore } from "@CM/Pages/Platform/Pools/Store";
import { useSettingsStore } from "@CM/Stores";

type Serie = { name: string; data: { x: number; y: number }[] };

// Props
interface Props {
  poolSelected: Pool | null;
}

const { poolSelected } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurvePoolsStore();
const storeSettings = useSettingsStore();

const reserves = computed((): Reserves[] => {
  return poolSelected ? store.reserves[poolSelected.address] ?? [] : [];
});

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "reserves",
        type: "area",
        animations: {
          enabled: false,
        },
      },
      colors: colorsArray,
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
    }
  );
});

const series = computed((): Serie[] => {
  return [
    {
      name: "reserves",
      data: reserves.value.map((r) => ({
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.reserves {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Reserves
tvl: TVL
</i18n>
