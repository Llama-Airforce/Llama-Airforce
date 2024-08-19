<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import { CollateralService, type TroveManagerDetails } from "@PM/Services";
import { createChartStyles } from "@/Styles/ChartStyles";

const { t } = useI18n();

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const collateralService = new CollateralService(flavor.value);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-collateral-price-impact",
    computed(() => vault?.collateral),
  ] as const,
  queryFn: ({ queryKey: [, collateral] }) => {
    if (collateral) {
      return collateralService
        .getCollateralPriceImpact("ethereum", collateral)
        .then((x) => x.impact);
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
  });
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
</script>

<template>
  <CardChart
    class="chart"
    :title="t('title')"
    :loading="loading"
    :options="options"
    :series="series"
  >
  </CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.cart-chart {
  :deep(.card-body) {
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
