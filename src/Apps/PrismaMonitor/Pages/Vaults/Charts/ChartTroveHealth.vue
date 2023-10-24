<template>
  <CardGraph
    class="health"
    :title="t('title')"
    :options="options"
    :series="series"
    :loading="loading"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph, useData } from "@/Framework";
import { type DataPoint, round, unit, formatNumber } from "@/Util";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores/SettingsStore";
import PrismaService, { type Trove } from "@PM/Services/PrismaService";
import { createChartStyles } from "@/Styles/ChartStyles";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import { getHost } from "@/Services/Host";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

const { t } = useI18n();

const prismaService = new PrismaService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
  trove?: Trove | null;
}
const { vault = null, trove = null } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

// Data
const { loading, data, loadData } = useData(async () => {
  if (vault && trove) {
    const rank = await prismaService
      .getTroveSnapshots("ethereum", vault.address, trove.owner)
      .then((x) => x.snapshots);
    return rank;
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
// eslint-disable-next-line max-lines-per-function
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme);
  const colorsArray = getColorsArray(storeSettings.theme);

  return createChartStyles(
    { colors, colorsArray },
    {
      chart: {
        animations: {
          enabled: false,
        },
        toolbar: {
          tools: {
            download: true,
          },
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          seriesName: "collateralUsd",
          tickAmount: 4,
          opposite: true,
          labels: {
            formatter: (y: number): string => formatterCollateralUsd(y),
          },
          min: 0,
          max: Math.max(...data.value.map((x) => x.collateral_usd)),
        },
        {
          seriesName: "ratio",
          tickAmount: 4,
          labels: {
            formatter: (y: number): string => formatterRatio(y),
          },
          min: 0,
          max: Math.max(...data.value.map((x) => x.cr ?? 0)),
        },
      ],
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        followCursor: false,
        enabled: true,
        intersect: false,
        custom: (x: DataPoint<Serie>) => {
          const collateralUsd =
            x.w.globals.initialSeries[0].data[x.dataPointIndex].y;

          const ratio = x.w.globals.initialSeries[1].data[x.dataPointIndex]
            ? x.w.globals.initialSeries[1].data[x.dataPointIndex].y
            : 0;

          const data = [
            `<div><b>${t("ratio")}</b>:</div><div>${formatterRatio(
              ratio
            )}</div>`,
            `<div><b>${t(
              "collateralUsd"
            )}</b>:</div><div>${formatterCollateralUsd(collateralUsd)}</div>`,
          ];

          return data.join("");
        },
      },
    }
  );
});

const series = computed((): Serie[] => {
  return [
    {
      name: t("collateralUsd"),
      type: "line",
      data: data.value.map((w) => ({
        x: w.timestamp * 1000,
        y: w.collateral_usd,
      })),
    },
    {
      name: t("ratio"),
      type: "line",
      data: data.value.map((w) => ({
        x: w.timestamp * 1000,
        y: w.cr ?? 0,
      })),
    },
  ];
});

// Methods
const formatterCollateralUsd = (x: number): string => {
  return `$${round(x, 1, "dollar")}${unit(x, "dollar")}`;
};

const formatterRatio = (x: number): string => {
  return `${formatNumber(x * 100, 2)}%`;
};

// Watches
watch(() => vault, loadData, { immediate: true });
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.health {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      grid-template-columns: auto auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Health
collateralUsd: Collateral ($)
ratio: Ratio
</i18n>
