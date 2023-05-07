<template>
  <CardGraph
    class="volumes"
    :title="t('volume')"
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
import type { Pool, Volume } from "@CM/Pages/Platform/Pools/Models";
import { useCurvePoolsStore } from "@CM/Pages/Platform/Pools/Store";
import { useCurveMonitorStore } from "@CM/Store";

type Serie = {
  name: string;
  data: { x: number; y: number }[];
};

// Props
interface Props {
  poolSelected: Pool | null;
}

const { poolSelected } = defineProps<Props>();

const { t } = useI18n();

// Refs
const store = useCurvePoolsStore();
const storeCM = useCurveMonitorStore();

const volumes = computed((): Volume[] => {
  return poolSelected ? store.volumes[poolSelected.id] ?? [] : [];
});

const options = computed((): unknown => {
  const colors = getColors(storeCM.theme);
  const colorsArray = getColorsArray(storeCM.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "volumes",
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
        seriesName: "volume",
        tickAmount: 4,
        labels: {
          formatter: (y: number): string => formatter(y),
        },
        min: Math.min(...volumes.value.map((x) => x.volumeUSD)),
        max: Math.max(...volumes.value.map((x) => x.volumeUSD)),
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
          const volumes = x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

          const data = [
            `<div><b>${t("volume")}</b>:</div><div>${formatter(volumes)}</div>`,
          ];

          return data.join("");
        },
      },
    }
  );
});

const series = computed((): Serie[] => {
  return [
    {
      name: t("volume"),
      data: volumes.value.map((s) => ({
        x: s.timestamp * 1000,
        y: s.volumeUSD,
      })),
    },
  ];
});

// Methods

const formatter = (x: number): string => {
  return `$${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.volumes {
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
volume: Volume
</i18n>
