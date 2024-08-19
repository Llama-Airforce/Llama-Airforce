<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import {
  TroveService,
  type Trove,
  type TroveManagerDetails,
} from "@PM/Services";
import { createChartStyles } from "@/Styles/ChartStyles";

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

const { t } = useI18n();

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const troveService = new TroveService(flavor.value);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
  trove?: Trove | null;
}
const { vault = null, trove = null } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-trove-snapshots",
    computed(() => vault?.address),
    computed(() => trove?.owner),
  ] as const,
  queryFn: ({ queryKey: [, vault, owner] }) => {
    if (vault && owner) {
      return troveService
        .getTroveSnapshots("ethereum", vault, owner)
        .then((x) => x.snapshots);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Refs
const options = computed(() => {
  return createChartStyles(theme.value, {
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
    stroke: {
      curve: "straight",
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
          `<div><b>${t("ratio")}</b>:</div><div>${formatterRatio(ratio)}</div>`,
          `<div><b>${t(
            "collateralUsd"
          )}</b>:</div><div>${formatterCollateralUsd(collateralUsd)}</div>`,
        ];

        return data.join("");
      },
    },
  });
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
</script>

<template>
  <CardChart
    class="health"
    :title="t('title')"
    :options="options"
    :series="series"
    :loading="loading"
  >
  </CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.health {
  :deep(.card-body) {
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
