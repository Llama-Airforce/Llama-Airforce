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
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import { type AccountData } from "@PM/Pages/VePrisma/VePrismaService";

const { t } = useI18n();
const storeSettings = useSettingsStore();

// Props
interface Props {
  totalWeight: number;
  lockers: AccountData[];
}
const { totalWeight = 0, lockers = [] } = defineProps<Props>();

const data = computed(() => lockers.slice(0, 10));

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme, storeSettings.flavor);
  const colorsArray = getColorsArray(storeSettings.theme, storeSettings.flavor);

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
          const value = x.series[x.seriesIndex] as unknown as number;
          const percentage = value / (totalWeight / 100);
          const data = [
            `<div><b>${address}</b>:</div><div>${formatterPct(
              percentage
            )} - ${formatter(value)}</div>`,
          ];

          return data.join("");
        },
      },
      // Empty unicode char for quick formatting hack as whitespace gets trimmed.
      labels: data.value
        .map((x) => x.id)
        .concat(["Other⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"]),
    }
  );
});

const series = computed(() => {
  const top10 = data.value.map((x) => x.weight);
  const top10Sum = top10.reduce((acc, x) => acc + x, 0);
  const other = totalWeight - top10Sum;

  return [...top10, other];
});
const categories = computed(() =>
  data.value.map((x) => x.id).concat(["Other"])
);

// Methods
const formatter = (x: number): string =>
  `${round(x, 2, "dollar")}${unit(x, "dollar")}`;

const formatterPct = (x: number): string =>
  `${round(x, 2, "percentage")}${unit(x, "percentage")}`;
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
</i18n>
