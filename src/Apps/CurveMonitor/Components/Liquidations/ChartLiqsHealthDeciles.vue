<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import { createChartStyles } from "@/Styles/ChartStyles";
import { type LiqHealthDecile } from "@CM/Services/Liquidations";

// Props
interface Props {
  deciles: LiqHealthDecile[];
}

const { deciles } = defineProps<Props>();

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
      enabled: true,
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

const categories = computed((): string[] => deciles.map((x) => x.decile));

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "Debt",
    data: Object.values(deciles).map((x) => x.debt),
  },
  {
    name: "Collateral",
    data: Object.values(deciles).map((x) => x.collateralUsdValue),
  },
  {
    name: "Stablecoin",
    data: Object.values(deciles).map((x) => x.stablecoin),
  },
]);

// Methods
const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>

<template>
  <CardChart
    class="chart"
    title="Debt & Assets per Health Deciles"
    :options
    :series
  ></CardChart>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.cart-chart {
  :deep(.card-body) {
    height: 300px;

    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>
