<template>
  <ChartApex
    class="chart"
    :options
    :series
  ></ChartApex>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { type LiquidationAggregate } from "@CM/Services/Liquidations";

type Serie = { name: string; data: { x: string; y: number }[] };

// Props
interface Props {
  liqs: LiquidationAggregate[];
}

const { liqs = [] } = defineProps<Props>();

// Refs
const { theme } = storeToRefs(useSettingsStore());

const options = computed(() => {
  return createChartStyles(theme.value, {
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
      show: true,
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

const categories = computed((): string[] =>
  chain(liqs)
    .orderBy((x) => x.timestamp, "asc")
    .groupBy((x) => x.timestamp)
    .map((_, timestamp) =>
      new Date(parseInt(timestamp, 10) * 1000).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .map((x, i) => (i % 8 === 0 ? x : ""))
    .value()
);

const series = computed((): Serie[] => [
  {
    name: "Self liquidations",
    data: Object.values(liqs).map((s) => ({
      x: new Date(s.timestamp * 1000).toLocaleDateString(),
      y: s.selfCount,
    })),
  },
  {
    name: "Hard liquidations",
    data: Object.values(liqs).map((s) => ({
      x: new Date(s.timestamp * 1000).toLocaleDateString(),
      y: s.hardCount,
    })),
  },
]);

const max = computed(
  (): number =>
    Math.max(
      ...chain(liqs)
        .groupBy((x) => x.timestamp)
        .map((supply) =>
          supply.reduce((acc, x) => acc + x.selfCount + x.hardCount, 0)
        )
        .value()
    ) * 1.1
);

const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `${round(y, 1, "dollar")}${unit(y, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  height: 300px;
  z-index: 0;

  &::v-deep(.apexcharts-tooltip-title) {
    display: none;
  }
}
</style>
