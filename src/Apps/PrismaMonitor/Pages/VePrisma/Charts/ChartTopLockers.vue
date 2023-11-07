<template>
  <CardGraph
    class="graph"
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
import { type DataPoint, round, unit } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import { type AccountData } from "@PM/Pages/VePrisma/VePrismaService";

const { t } = useI18n();
const storeSettings = useSettingsStore();

// Props
interface Props {
  lockers: AccountData[];
}
const { lockers = [] } = defineProps<Props>();

const data = computed(() => lockers.slice(0, 10));

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "topLockers",
        type: "donut",
        animations: {
          enabled: false,
        },
      },
      legend: {
        inverseOrder: false,
        position: "bottom",
      },
      stroke: {
        width: 0.5,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },

      tooltip: {
        custom: (x: DataPoint<number>) => {
          const address = categories.value[x.seriesIndex];
          const value = x.series[x.seriesIndex];
          const data = [
            `<div><b>${address}</b>:</div><div>${formatter(
              value as unknown as number
            )}</div>`,
          ];

          return data.join("");
        },
      },
      labels: data.value.map((x) => x.id),
    }
  );
});

const series = computed(() => data.value.map((x) => x.weight));
const categories = computed(() => data.value.map((x) => x.id));

// Methods
const formatter = (x: number): string =>
  `${round(x, 2, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }

    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Top 10 largest lockers
numPos: "mkUSD balance:"
</i18n>
