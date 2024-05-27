<template>
  <CardChart
    class="chart"
    :title="t('title')"
    :options
    :series
  ></CardChart>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import { createChartStyles } from "@/Styles/ChartStyles";
import { type LoanDistribution } from "@CM/Services/Lending";

const { t } = useI18n();

// Props
interface Props {
  distribution: LoanDistribution;
}

const { distribution } = defineProps<Props>();

// Refs
const { theme } = storeToRefs(useSettingsStore());

const options = computed(() => {
  return createChartStyles(theme.value, {
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
      enabled: false,
      intersect: true,
      custom: (x: DataPoint<number>) => {
        const debt = x.series[0][x.dataPointIndex];
        const collateral = x.series[1][x.dataPointIndex];
        const stablecoin = x.series[2][x.dataPointIndex];
        const data = [
          `<div><b>Collat. (USD)</b>: ${formatterY(collateral)}</div>`,
          `<div><b>Debt</b>: ${formatterY(debt)}</div>`,
          `<div><b>Stablecoin</b>: ${formatterY(stablecoin)}</div>`,
        ];

        return data.join("");
      },
    },
  });
});

const categories = computed((): string[] =>
  distribution.debt.map((x) => x.label)
);

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "Debt",
    data: distribution.debt.map((x) => x.value),
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
  ::v-deep(.card-body) {
    height: 300px;

    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Loan Distribution
</i18n>
