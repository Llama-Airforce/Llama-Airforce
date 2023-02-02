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
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { CardGraph } from "@/Framework";
import { round, unit, type DataPoint } from "@/Util";
import createChartStyles from "@/Styles/ChartStyles";
import type { Volume } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";

type Serie = {
  name: string;
  data: { x: number; y: number }[];
};

const { t } = useI18n();

// Refs
const store = useCurveMonitorStore();

const volumes = $computed((): Volume[] => {
  return store.volumes;
});

const options = $computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "volumes",
      type: "area",
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      seriesName: "volume",
      tickAmount: 4,
      labels: {
        formatter: (y: number): string => formatter(y),
      },
      min: Math.min(...volumes.map((x) => x.volumeUSD)),
      max: Math.max(...volumes.map((x) => x.volumeUSD)),
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

const series = $computed((): Serie[] => {
  return [
    {
      name: t("volume"),
      data: volumes.map((s) => ({
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
