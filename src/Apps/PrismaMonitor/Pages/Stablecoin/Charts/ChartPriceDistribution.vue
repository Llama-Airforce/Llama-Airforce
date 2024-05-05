<template>
  <CardGraph
    :title="t('title')"
    :loading="loading"
    :series="series"
    :options="options"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { CardGraph, usePromise } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import { getHost, StableService } from "@PM/Services";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const stableService = new StableService(getHost(), storeSettings.flavor);

// Data
const { loading, data } = usePromise(
  () =>
    stableService
      .getPriceHistogram("ethereum", 10, "all")
      .then((x) => x.histogram),
  []
);

const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme, storeSettings.flavor);
  const colorsArray = getColorsArray(storeSettings.theme, storeSettings.flavor);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        id: "distribution",
        type: "bar",
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: categories.value,
        labels: {
          rotate: -55,
        },
        tickPlacement: "on",
      },
      legend: {
        inverseOrder: true,
      },
      stroke: {
        width: 0.5,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: true,
      },
    }
  );
});

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("numPos"),
    data: Object.values(data.value).map((x) => x.value),
  },
]);

const categories = computed(() => data.value.map((x) => formatLabel(x.label)));

// Reduce insane number of decimal digits in labels from API.
const formatLabel = (label: string): string => {
  // Regular expression to match numbers in the string
  const numberRegex = /-?\d+(\.\d+)?/g;

  // Function to round a number to 4 decimal places
  const roundToFourDigits = (numString: string): string => {
    const num = parseFloat(numString);
    return num.toFixed(4);
  };

  // Replace each number in the string with its rounded version
  return label.replace(numberRegex, (match) => roundToFourDigits(match));
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
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
title: Price histogram
numPos: "# of hourly price records"
</i18n>
