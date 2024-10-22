<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { type AccountData } from "@PM/Pages/VePrisma/VePrismaService";

const { t } = useI18n();

const { totalWeight = 0, lockers = [] } = defineProps<{
  totalWeight: number;
  lockers: AccountData[];
}>();

const data = computed(() => lockers.slice(0, 10));

const options = computed(() => {
  return createChartStyles({
    chart: {
      id: "topLockers",
      type: "donut",
      animations: {
        enabled: false,
      },
    },
    legend: {
      inverseOrder: false,
      position: "bottom",
    },
    stroke: {
      width: 0.5,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    tooltip: {
      custom: (x: DataPoint<number>) => {
        const address = categories.value[x.seriesIndex];
        const value = x.series[x.seriesIndex] as unknown as number;
        const percentage = value / (totalWeight / 100);
        const data = [
          `<div><b>${address}</b>:</div><div>${formatterPct(
            percentage
          )} - ${formatter(value)}</div>`,
        ];

        return data.join("");
      },
    },
    // Empty unicode char for quick formatting hack as whitespace gets trimmed.
    labels: data.value
      .map((x) => x.id)
      .concat(["Other⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"]),
  });
});

const series = computed(() => {
  const top10 = data.value.map((x) => x.weight);
  const top10Sum = top10.reduce((acc, x) => acc + x, 0);
  const other = totalWeight - top10Sum;

  return [...top10, other];
});
const categories = computed(() =>
  data.value.map((x) => x.id).concat(["Other"])
);

// Methods
const formatter = (x: number) => `${round(x, 2, "dollar")}${unit(x)}`;
const formatterPct = (x: number) => `${round(x, 2, "percentage")}%`;
</script>

<template>
  <Card :title="t('title')">
    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>

<i18n lang="yaml" locale="en">
title: Top 10 largest lockers
</i18n>
