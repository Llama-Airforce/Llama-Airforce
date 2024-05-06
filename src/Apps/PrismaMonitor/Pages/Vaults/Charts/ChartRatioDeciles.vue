<template>
  <CardGraph
    class="chart"
    :title="t('title')"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardGraph>
</template>

<script setup lang="ts">
import { round, unit } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { getHost, ManagerService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const managerService = new ManagerService(getHost(), storeSettings.flavor);

// Data
const { loading, data } = usePromise(
  () =>
    managerService
      .getRatioDistributionGrouped("ethereum")
      .then((x) => x.deciles),
  []
);

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
  const colors = getColors(storeSettings.theme, storeSettings.flavor);
  const colorsArray = getColorsArray(storeSettings.theme, storeSettings.flavor);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
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
          formatter: formatterX,
          rotate: -60,
        },
        tickPlacement: "on",
      },
      yaxis: {
        labels: {
          formatter: formatterY,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      legend: {
        show: true,
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

const categories = computed((): string[] => data.value.map((x) => x.label));

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("debt"),
    data: Object.values(data.value).map((x) => x.data),
  },
]);

// Methods
const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
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
title: Debt per Collateral Ratio Deciles
debt: Debt
</i18n>
