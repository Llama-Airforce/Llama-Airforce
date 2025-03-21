<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { colors } from "@/Styles/ChartTheme";
import type { Overview } from "../../Models";
import { useBribesStore } from "../../Store";
import { getDate } from "../../Util/EpochHelper";
import { vlAssetSymbol } from "../../Util/ProtocolHelper";

const { t } = useI18n();

const { overview } = defineProps<{
  overview?: Overview;
}>();

const { protocol } = storeToRefs(useBribesStore());

const epochs = computed(() => (overview?.epochs ?? []).takeRight(26));

const options = computed(() =>
  createChartStyles({
    chart: {
      id: "votium-bribe-revenue",
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories: [...epochs.value]
        // Duplicate and order from old to new.
        .sort((x, y) => x.round - y.round)
        .map((epoch) => getDate(epoch)),
    },
    yaxis: [
      {
        tickAmount: 4,
        labels: {
          formatter: (y: number) => `$${round(y, 2, "dollar")}${unit(y)}`,
          style: { colors: [colors.value.blue] },
        },
      },
      {
        opposite: true,
        tickAmount: 4,
        labels: {
          formatter: (y: number) =>
            `$${round(
              y,
              protocol.value === "cvx-prisma" ? 5 : 2,
              "dollar"
            )}${unit(y)}`,
          style: { colors: [colors.value.yellow] },
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
      formatter: (y: number): string => `$${round(y, 2, "dollar")}${unit(y)}`,
      offsetY: -25,
      style: {
        fontSize: "12px",
        fontFamily:
          "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
      },
    },
  })
);

const series = computed(
  (): {
    name: string;
    type: string;
    data: { x: string; y: number }[];
  }[] => [
    {
      name: t("revenue"),
      type: "column",
      data: [...epochs.value]
        // Duplicate and order from old to new.
        .sort((x, y) => x.round - y.round)
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
        .sort((x, y) => x.round - y.round)
        .map((epoch) => ({
          x: getDate(epoch),
          y: epoch.dollarPerVlAsset,
        })),
    },
  ]
);
</script>

<template>
  <Card :title="t('title')">
    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: Round by Round
revenue: Revenue
</i18n>
