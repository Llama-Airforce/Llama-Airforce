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
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph, useData } from "@/Framework";
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { getHost } from "@/Services/Host";
import PrismaService from "@PM/Services/PrismaService";
import { useSettingsStore } from "@PM/Stores/SettingsStore";

const { t } = useI18n();

type TooltipParams = {
  series: number[][];
  dataPointIndex: number;
  w: { globals: { seriesNames: string[] } };
};

const prismaService = new PrismaService(getHost());
const storeSettings = useSettingsStore();

// Data
const { loading, data, loadData } = useData(
  () =>
    prismaService
      .getHistoricalOpenTrovesOverview("ethereum", "6m")
      .then((x) => x.managers),
  []
);

// Hooks
onMounted(() => void loadData());

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        type: "bar",
        stacked: "true",
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
        custom: ({ series, dataPointIndex, w }: TooltipParams) => {
          let total = 0;
          const data = series.map((managerSeries, index) => {
            const value = managerSeries[dataPointIndex];
            total += value;
            return `<div><b>${w.globals.seriesNames[index]}</b>: ${value}</div>`;
          });

          // Add total
          data.push(`<div><b>Total</b>: ${total}</div>`);

          return data.join("");
        },
      },
    }
  );
});

const categories = computed((): string[] => {
  if (data.value.length === 0 || data.value[0].data.length === 0) {
    return [];
  }

  return data.value[0].data.map((point) => {
    return new Date(point.timestamp * 1000).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
    });
  });
});

const series = computed(() => {
  if (data.value.length === 0) {
    return [];
  }

  return data.value.map((managerData) => {
    return {
      name: managerData.manager,
      data: managerData.data.map((point) => point.value),
    };
  });
});

// Methods
const formatterX = (x: string): string => x;
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
title: Open troves
</i18n>
