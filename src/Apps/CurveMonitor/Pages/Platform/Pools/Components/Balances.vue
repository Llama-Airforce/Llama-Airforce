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
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph } from "@/Framework";
import { round, unit, type DataPoint } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/CM";
import type { Pool, Reserves } from "@CM/Pages/Platform/Pools/Models";
import { useCurvePoolsStore } from "@CM/Pages/Platform/Pools/Store";
import { useSettingsStore } from "@CM/Stores";

const { t } = useI18n();

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
const store = useCurvePoolsStore();
const storeSettings = useSettingsStore();

const reserves = computed((): Reserves[] => {
  return poolSelected ? store.reserves[poolSelected.address] ?? [] : [];
});

const numCoins = computed((): number => {
  return poolSelected
    ? store.reserves[poolSelected.address]?.[0]?.reservesUSD?.length
    : 0;
});

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "balances",
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: [...Array(numCoins.value).keys()].map((i) => createAxisY(i)),
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
          const percentages = [...Array(numCoins.value).keys()].map(
            (i) => x.w.globals.initialSeries[i].data[x.dataPointIndex].y
          );

          const data = percentages.map(
            (p, i) =>
              `<div><b>${address(i).substring(
                0,
                10
              )}</b>:</div><div>${formatter(p)}</div>`
          );

          return data.join("");
        },
      },
    }
  );
});

const series = computed((): Serie[] => {
  return [...Array(numCoins.value).keys()].map((i) => createSerie(i));
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
    data: reserves.value.map((r) => ({
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
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Balances
</i18n>
