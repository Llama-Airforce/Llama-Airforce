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
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph, usePromise } from "@/Framework";
import { type DataPoint, round, unit } from "@/Util";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import CollateralService from "@PM/Services/CollateralService";
import { createChartStyles } from "@/Styles/ChartStyles";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import { getHost } from "@/Services/Host";

const { t } = useI18n();
const collateralService = new CollateralService(getHost());
const storeSettings = useSettingsStore();

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { loading, data, load } = usePromise(() => {
  if (vault) {
    return collateralService
      .getCollateralPriceImpact("ethereum", vault.collateral)
      .then((x) => x.impact);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
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
          formatter: (x: number): string => formatter(x),
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
          if (!vault) {
            return "";
          }

          const amount = categories.value[x.dataPointIndex];
          const dollars = formatter(amount * vault.price);
          const tooltip = `
          <div><b>Collateral sold:</b>:</div>
          <div>${formatter(amount)} ${vault.name} ($${dollars})</div>

          <div><b>Price impact:</b>:</div>
          <div>${pctFormatter(x.series[0][x.dataPointIndex])}</div>
          `;
          return tooltip;
        },
      },
    }
  );
});

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("priceImpact"),
    data: Object.values(data.value).map((x) => x.impact),
  },
]);

const categories = computed(() =>
  data.value.map((x) => (vault ? x.amount / vault.price : 0))
);

// Methods
const formatter = (x: number): string => {
  return `${round(Math.abs(x), 1, "dollar")}${unit(x, "dollar")}`;
};

const pctFormatter = (y: number): string => {
  return `${round(y, 2, "percentage")}${unit(y, "percentage")}`;
};

// Watches
watch(() => vault, load);
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
