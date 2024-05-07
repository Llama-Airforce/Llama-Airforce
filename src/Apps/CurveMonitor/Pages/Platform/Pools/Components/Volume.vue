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
import { createChartStyles } from "@/Styles/ChartStyles";
import type { Pool, Volume } from "@CM/Pages/Platform/Pools/Models";
import { useCurvePoolsStore } from "@CM/Pages/Platform/Pools/Store";
import { useSettingsStore } from "@CM/Stores";

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
const { theme } = storeToRefs(useSettingsStore());

const volumes = computed((): Volume[] => {
  return poolSelected ? store.volumes[poolSelected.address] ?? [] : [];
});

const options = computed((): unknown => {
  const { colorsArray } = theme.value;

  return createChartStyles(theme.value, {
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
  });
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
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
volume: Volume
</i18n>
