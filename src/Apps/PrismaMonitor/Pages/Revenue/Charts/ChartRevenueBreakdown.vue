<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { type SnapshotRevenue } from "@PM/Services";

type Serie = { name: string; data: { x: string; y: number }[] };

const { data = [] } = defineProps<{
  data: SnapshotRevenue[];
}>();

const options = computed(() => {
  return createChartStyles({
    chart: {
      type: "bar",
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: formatterX,
        rotate: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: formatterY,
      },
      min: 0,
      max: max.value,
    },
    plotOptions: {
      bar: {
        columnWidth: "75%",
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
    },
  });
});

const categories = computed(() =>
  data
    .orderBy((x) => x.timestamp, "asc")
    .groupBy((x) => x.timestamp)
    .entries()
    .map(([timestamp]) =>
      new Date(parseInt(timestamp, 10) * 1000).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .map((x, i) => (i % 8 === 0 ? x : ""))
);

const series = computed((): Serie[] =>
  Object.keys(data[0])
    .filter((x) => x !== "timestamp")
    .map((source) => data.map((x) => ({ ...x, source })))
    .flat()
    .groupBy((x) => x.source)
    .entries()
    .map(([source, snapshot]) => ({
      name: sourceToLabel(source),
      data: snapshot
        .orderBy((s) => s.timestamp, "asc")
        .map((s) => ({
          x: new Date(s.timestamp * 1000).toLocaleDateString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          y: (s as any)[source] as number,
        })),
    }))
);

const max = computed(
  () =>
    Math.max(
      ...data
        .groupBy((x) => x.timestamp)
        .entries()
        .map(([, supply]) =>
          supply.reduce((acc, x) => acc + totalRevenue(x), 0)
        )
    ) * 1.1
);

const formatterX = (x: string) => x;
const formatterY = (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`;

const totalRevenue = (s: SnapshotRevenue) =>
  s.unlock_penalty_revenue_usd +
  s.borrowing_fees_revenue_usd +
  s.redemption_fees_revenue_usd;

const sourceToLabel = (x: string): string => {
  switch (x) {
    case "unlock_penalty_revenue_usd":
      return "Unlock penalty";
    case "borrowing_fees_revenue_usd":
      return "Borrowing fees";
    case "redemption_fees_revenue_usd":
      return "Redemption fees";
    default:
      return snakeToPascal(x);
  }
};

const snakeToPascal = (str: string): string =>
  str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
</script>

<template>
  <ChartApex
    :options="options"
    :series="series"
  ></ChartApex>
</template>

<style scoped>
.chart {
  height: 300px;
  z-index: 0;

  &:deep(.apexcharts-tooltip-title) {
    display: none;
  }
}
</style>
