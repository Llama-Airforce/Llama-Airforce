<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import type { LiqHealthDecile } from "@curvefi/prices-api/liquidations";

const { deciles } = defineProps<{
  deciles: LiqHealthDecile[];
}>();

const options = computed(() =>
  createChartStyles({
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
  })
);

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
const formatterX = (x: string) => x;
const formatterY = (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`;
</script>

<template>
  <Card title="Debt & Assets per Health Deciles">
    <ChartApex
      :options
      :series
    />
  </Card>
</template>
