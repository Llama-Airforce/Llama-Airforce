<script setup lang="ts">
import { createChartStylesLAF } from "@/Styles/ChartStyles";
import type { Epoch } from "@LAF/Pages/Bribes/Models";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";

type Serie = { name: string; data: number[] };

const { t } = useI18n();

const { epoch } = defineProps<{
  epoch?: Epoch;
}>();

// Refs
const { protocol } = storeToRefs(useBribesStore());

const bribes = computed(() => {
  const stinkBid = protocol.value === "aura-bal" ? 0 : 2500;

  // Filter stink bids.
  return (epoch?.bribes ?? []).filter(
    (bribe) => bribe.amountDollars > stinkBid
  );
});

const categories = computed(() =>
  bribes.value
    .groupBy((bribe) => bribe.pool)
    .entries()
    .map(([, bribes]) =>
      bribes.reduce(
        (acc, bribe) => ({
          pool: acc.pool,
          amountDollars: acc.amountDollars + bribe.amountDollars,
        }),
        { pool: bribes[0].pool, amountDollars: 0 }
      )
    )
    .orderBy((x) => x.amountDollars, "desc")
    .map((x) => x.pool)
    .take(20)
);

const options = computed(() => {
  return createChartStylesLAF({
    chart: {
      id: "votium-bribe-round",
      type: "bar",
      stacked: true,
    },
    xaxis: {
      categories: categories.value,
    },
    yaxis: {
      labels: {
        formatter: (y: number): string =>
          `$${round(y, 2, "dollar")}${unit(y, "dollar")}`,
      },
    },
    plotOptions: {
      bar: {
        columnWidth:
          optimalColumnWidthPercent(categories.value.length).toString() + "%",
        distributed: true,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      intersect: false,
      custom: (x: DataPoint<Serie>) => {
        const data = x.w.globals.initialSeries
          .map((token) => ({
            token: token.name,
            sum: token.data[x.dataPointIndex],
          }))
          .filter((x) => x.sum > 0)
          .map((x) => ({
            token: x.token,
            sum: `$${round(x.sum, 2, "dollar")}${unit(x.sum, "dollar")}`,
          }))
          .orderBy((x) => x.sum, "desc")
          .map((x) => `<div><b>${x.token}</b>:</div><div>${x.sum}</div>`);

        return data.join("");
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (_value: number, x: DataPoint<Serie>) => {
        if (x.seriesIndex === x.w.config.series.length - 1) {
          const sum = x.w.globals.stackedSeriesTotals[x.dataPointIndex];
          return `$${round(sum, 2, "dollar")}${unit(sum, "dollar")}`;
        }
        return "";
      },
      offsetY: -25,
      style: {
        fontSize: "12px",
        fontFamily:
          "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace",
      },
    },
  });
});

const series = computed((): Serie[] =>
  bribes.value
    // Create a series per token paid.
    .groupBy((bribe) => bribe.token)
    .entries()
    .map(([token, bribes]) => ({
      name: token,
      // For each pool we will aggregate the bribes for that pool.
      data: categories.value.map((pool) =>
        bribes.reduce(
          (acc, bribe) =>
            bribe.pool === pool ? acc + bribe.amountDollars : acc,
          0
        )
      ),
    }))
);

// Methods
const optimalColumnWidthPercent = (numBars: number): number => {
  return 20 + 60 / (1 + 30 * Math.exp(-numBars / 3));
};
</script>

<template>
  <Card :title="t('title')">
    <ChartApex
      :options
      :series
    ></ChartApex>
  </Card>
</template>

<style scoped>
.chart {
  &:deep(.apexcharts-tooltip) {
    grid-template-columns: 1fr auto;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Rewards
</i18n>
