<template>
  <CardGraph
    class="ratios"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { orderBy, last } from "lodash";
import { CardGraph } from "@/Framework";
import { shorten, type DataPoint } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import Ratio from "@LAF/Pages/Curve/Utilization/Models/Ratio";
import { useCurveStore } from "@LAF/Pages/Curve/Store";

type Serie = {
  name: string;
  data: { x: number; y: number; ratio: number }[];
};

const { t } = useI18n();

// Refs
const store = useCurveStore();

const ratios = computed((): { [gauge: string]: Ratio[] } => {
  return Object.entries(store.ratios)
    .filter(([gauge, ratios]) => gauge.length > 0 && ratios.length > 0)
    .reduce(
      (res, [gauge, ratios]) => Object.assign(res, { [gauge]: ratios }),
      {}
    );
});

const options = computed((): unknown => {
  return createChartStylesLAF({
    chart: {
      id: "curve-ratios",
      type: "heatmap",
      // Takes too long kek.
      animations: {
        enabled: false,
      },
    },
    grid: {
      padding: {
        top: 0,
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      y: {
        formatter: (_: number, p: DataPoint<Serie>) => {
          return p.w.globals.initialSeries[p.seriesIndex].data[p.dataPointIndex]
            .ratio;
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: -2,
              to: 0,
              color: "#000000",
              name: "none",
            },
            {
              from: 0,
              to: 0.001,
              color: "#888888",
              name: "new",
            },
            {
              from: 0.001,
              to: 0.05,
              color: "#ff5757",
              name: "low",
            },
            {
              from: 0.05,
              to: 0.4,
              color: "#ffcc00",
              name: "medium",
            },
            {
              from: 0.4,
              to: 10,
              color: "#7ed957",
              name: "high",
            },
          ],
        },
      },
    },
  });
});

const series = computed((): Serie[] => {
  return orderBy(
    Object.entries(ratios.value).map(([gauge, ratios]) => ({
      name: shorten(gauge),
      data: orderBy(
        fill(
          ratios
            .slice()
            .reverse()
            .map((ratio) => ({
              x: ratio.timeStamp * 1000,
              y: Math.log(1 + ratio.ratio),
              ratio: ratio.ratio,
            })),
          26,
          { x: ratios[0].timeStamp * 1000, y: -1, ratio: 0 }
        ),
        (x) => x.x
      ),
    })),
    // Order by the last non zero ratio of each gauge.
    (serie) =>
      last(serie.data.filter((datapoint) => datapoint.ratio > 0))?.y ?? 0
  );
});

// Methods
const fill = <T>(array: T[], num: number, empty: T): T[] => {
  const diff = num - array.length;
  if (diff > 0) {
    return [...Array<T>(diff).fill(empty), ...array];
  } else {
    return array;
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.emissions {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Fees / Emissions Ratios
</i18n>
