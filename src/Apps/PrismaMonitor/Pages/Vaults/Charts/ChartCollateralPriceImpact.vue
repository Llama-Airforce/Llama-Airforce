<template>
  <CardGraph
    class="chart"
    :title="t('title')"
    :loading="loading"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import {CardGraph} from "@/Framework";
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";

import {getColors, getColorsArray} from "@/Styles/Themes/PM";
import {useSettingsStore} from "@PM/Stores/SettingsStore";
import PrismaService, { type PriceImpact} from "@PM/Services/PrismaService";
import {type DataPoint, round, unit} from "@/Util";
import {createChartStyles} from "@/Styles/ChartStyles";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import {getHost} from "@/Services/Host";

const {t} = useI18n();
const prismaService = new PrismaService(getHost());
const storeSettings = useSettingsStore();

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Refs
const data = ref<PriceImpact[]>([]);
const loading = ref(false);


// Hooks
onMounted(async (): Promise<void> => {
  loading.value = true;

  data.value = await prismaService
    .getCollateralPriceImpact("ethereum", vault.collateral)
    .then((x) => x.impact);

  loading.value = false;
});

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    {colors, colorsArray},
    {
      chart: {
        type: "area",
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 0,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      toolbar: {
        show: false,
      },
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: (x: number): string => formatter(x)
        },
      },
      yaxis: {
        seriesName: "impact",
        labels: {
          formatter: (y: number): string => pctFormatter(y),
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        custom: (x: DataPoint<number>) => {
          const amount =  categories.value[x.dataPointIndex];
          const tooltip = `
          <div><b>Collateral sold:</b>:</div>
          <div>${formatter(amount)} ${vault.name} ($${formatter(amount * vault.price)})</div>

          <div><b>Price impact:</b>:</div>
          <div>${pctFormatter(x.series[0][x.dataPointIndex])}</div>
          `;
          return tooltip;
        }
      },
    });
});

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("priceImpact"),
    data: Object.values(data.value).map((x) => x.impact),
  },
]);
const categories = computed(() => data.value.map((x) => x.amount / vault.price));


const formatter = (x: number): string => {
  return `${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};

const pctFormatter = (y: number): string => {
  return `${round(y, 2, "percentage")}${unit(y, "percentage")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: On-chain Selling Price Impact
priceImpact: Price impact
</i18n>
