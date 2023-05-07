<template>
  <CardGraph
    class="revenue"
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
import { round, unit } from "@/Util";
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getDate } from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import type {
  EpochOverview,
  Overview,
  Protocol,
} from "@LAF/Pages/Bribes/Models";

const { t } = useI18n();

// Refs
const store = useBribesStore();

const overview = computed((): Overview | null => {
  return store.selectedOverview;
});

const epochs = computed((): EpochOverview[] => {
  return overview.value?.epochs ?? [];
});

const protocol = computed((): Protocol | null => {
  return store.selectedProtocol;
});

const options = computed((): unknown => {
  return createChartStylesLAF({
    chart: {
      id: "votium-bribe-revenue",
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories: [...epochs.value]
        // Duplicate and order from old to new.
        .sort((x: EpochOverview, y: EpochOverview) => x.round - y.round)
        .map((epoch) => getDate(epoch)),
    },
    yaxis: [
      {
        tickAmount: 4,
        labels: {
          formatter: (y: number): string =>
            `$${round(y, 2, "dollar")}${unit(y, "dollar")}`,
          style: { colors: [ColorsLAFDark.blue] },
        },
      },
      {
        opposite: true,
        tickAmount: 4,
        labels: {
          formatter: (y: number): string =>
            `$${round(y, 2, "dollar")}${unit(y, "dollar")}`,
          style: { colors: [ColorsLAFDark.yellow] },
        },
      },
    ],
    plotOptions: {
      bar: {
        columnWidth: "15%",
        distributed: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    markers: { size: 3 },
    dataLabels: {
      enabled: false,
      formatter: (y: number): string =>
        `$${round(y, 2, "dollar")}${unit(y, "dollar")}`,
      offsetY: -25,
      style: {
        fontSize: "12px",
        fontFamily: "SF Mono, Consolas, monospace",
      },
    },
  });
});

const series = computed(
  (): {
    name: string;
    type: string;
    data: { x: string; y: number }[];
  }[] => {
    return [
      {
        name: t("revenue"),
        type: "column",
        data: [...epochs.value]
          // Duplicate and order from old to new.
          .sort((x: EpochOverview, y: EpochOverview) => x.round - y.round)
          .map((epoch) => ({
            x: getDate(epoch),
            y: epoch.totalAmountDollars,
          })),
      },
      {
        name: `$/${vlAssetSymbol(protocol.value)}`,
        type: "line",
        data: [...epochs.value]
          // Duplicate and order from old to new.
          .sort((x: EpochOverview, y: EpochOverview) => x.round - y.round)
          .map((epoch) => ({
            x: getDate(epoch),
            y: epoch.dollarPerVlAsset,
          })),
      },
    ];
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.revenue {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Round by Round
revenue: Revenue
</i18n>
