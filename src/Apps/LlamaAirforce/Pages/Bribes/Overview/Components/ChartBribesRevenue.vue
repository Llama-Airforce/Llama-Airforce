<script setup lang="ts">
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getDate } from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import type { EpochOverview, Overview } from "@LAF/Pages/Bribes/Models";

const { t } = useI18n();

// Props
interface Props {
  overview?: Overview;
}

const { overview } = defineProps<Props>();

// Refs
const { protocol } = storeToRefs(useBribesStore());

const epochs = computed((): EpochOverview[] => overview?.epochs ?? []);

const options = computed(() => {
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
            `$${round(
              y,
              protocol.value === "cvx-prisma" ? 5 : 2,
              "dollar"
            )}${unit(y, "dollar")}`,
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
        fontFamily:
          "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
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

<template>
  <CardChart
    class="revenue"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.revenue {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Round by Round
revenue: Revenue
</i18n>
