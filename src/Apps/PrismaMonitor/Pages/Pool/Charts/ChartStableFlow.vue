<template>
  <CardChart
    :title="t('title', { stable: stableSymbol(flavor) })"
    :loading="loading"
    :options="options"
    :series="series"
  ></CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@PM/Stores";
import { StabilityPoolService } from "@PM/Services";
import { stableSymbol } from "@PM/Models/Flavor";

const { t } = useI18n();

type TooltipParams = {
  series: number[][];
  dataPointIndex: number;
  w: { globals: { seriesNames: string[] } };
};

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const sbService = new StabilityPoolService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-flow"],
  queryFn: () => sbService.getStableFlow("ethereum", "1m"),
  initialData: { deposits: [], withdrawals: [] },
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  const { colors } = theme.value;

  return createChartStyles(theme.value, {
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
    colors: [colors.green, colors.red],

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
      custom: ({ series, dataPointIndex, w }: TooltipParams) => {
        let total = 0;
        const data = series.map((managerSeries, index) => {
          const value = managerSeries[dataPointIndex];
          total += value;
          return `<div><b>${w.globals.seriesNames[index]}</b>:\t${formatterY(
            value
          )}</div>`;
        });

        // Add total
        data.push(`<div><b>Total</b>:\t${formatterY(total)}</div>`);

        return data.join("");
      },
    },
  });
});

const categories = computed((): string[] => {
  if (data.value.deposits.length === 0) {
    return [];
  }

  return data.value.deposits.map((point) => {
    return new Date(point.timestamp * 1000).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
    });
  });
});

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("deposits"),
    data: Object.values(data.value.deposits).map((x) => x.value),
  },
  {
    name: t("withdrawals"),
    data: Object.values(data.value.withdrawals).map((x) => x.value),
  },
]);

// Methods
const formatterX = (x: string): string => x;
const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>

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
title: "{stable} deposits and withdrawals"
deposits: Deposits
withdrawals: Withdrawals
</i18n>
