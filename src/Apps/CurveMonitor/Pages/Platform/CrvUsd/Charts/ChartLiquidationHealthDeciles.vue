<template>
  <CardGraph
    class="chart"
    title="Debt & Assets per Health Deciles"
    :loading
    :options
    :series
  ></CardGraph>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { type Market } from "@CM/Services/CrvUsd";
import { useQueryLiqHealthDeciles } from "@CM/Services/CrvUsd/Queries";

// Props
interface Props {
  market?: Market;
}

const { market } = defineProps<Props>();

// Refs
const { theme } = storeToRefs(useSettingsStore());

// Data
const { isFetching: loading, data } = useQueryLiqHealthDeciles(
  toRef(() => market)
);

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

const categories = computed((): string[] => data.value.map((x) => x.decile));

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: "Debt",
    data: Object.values(data.value).map((x) => x.debt),
  },
  {
    name: "Collateral",
    data: Object.values(data.value).map((x) => x.collateralUsdValue),
  },
  {
    name: "Stablecoin",
    data: Object.values(data.value).map((x) => x.stablecoin),
  },
]);

// Methods
const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
  ::v-deep(.card-body) {
    height: 300px;

    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}
</style>
