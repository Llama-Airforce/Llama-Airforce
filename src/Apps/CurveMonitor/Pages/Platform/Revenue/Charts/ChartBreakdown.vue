<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import {
  useQueryCrvUsdWeekly,
  useQueryPoolsWeekly,
} from "@CM/Services/Revenue/Queries";

type Serie = {
  name: string;
  data: { x: string; y: number }[];
};

// Refs
const theme = useTheme();

// Legend
const { items } = useLegend(() => [
  {
    id: "crvusd",
    label: "crvUSD",
    color: theme.value.colorsArray[0],
  },
  {
    id: "pools",
    label: "Pools",
    color: theme.value.colorsArray[1],
  },
]);

// Data
const { isFetching: loadingCrvUsd, data: crvUsd } = useQueryCrvUsdWeekly();
const { isFetching: loadingPools, data: pools } = useQueryPoolsWeekly();

const loading = computed(() => loadingCrvUsd.value || loadingPools.value);

// Chart
const options = computed(() => {
  const { colors, colorsArray } = {
    colors: theme.value.colors,
    colorsArray: [theme.value.colorsArray[0], theme.value.colorsArray[1]],
  };

  return createChartStyles(
    {
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
          formatter: (x: string): string => x,
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
          formatter: (y: number): string =>
            `$${round(y, 0, "dollar")}${unit(y)}`,
        },
        min: 0,
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
    },
    ref({ colors, colorsArray })
  );
});

function feesPerTimestamp(xs: { timestamp: number; feesUsd: number }[]) {
  return xs
    .groupBy((x) => x.timestamp)
    .entries()
    .map(([timestamp, xs]) => {
      const sum = xs.reduce((acc, x) => acc + x.feesUsd, 0);

      return {
        timestamp: Number(timestamp),
        feesUsd: sum,
      };
    })
    .orderBy((x) => x.timestamp, "asc");
}

const timestamps = computed((): number[] => {
  const feesCrvUsd = feesPerTimestamp(crvUsd.value);
  const feesPools = feesPerTimestamp(pools.value);

  return (
    feesCrvUsd
      .concat(feesPools)
      .groupBy((x) => x.timestamp)
      .entries()
      .map(([, feeCategories]) => ({
        timestamp: feeCategories[0].timestamp,
        numLabels: feeCategories.length,
      }))
      .orderBy((x) => x.timestamp, "asc")
      // We want to start at the first occurance of both crvUSD and pools data.
      .dropWhile((x) => x.numLabels < 2)
      .map((x) => x.timestamp)
  );
});

function toCategory(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });
}

const categories = computed(() =>
  timestamps.value.map((timestamp) => toCategory(timestamp))
);

const series = computed((): Serie[] => {
  function toDataPoints(xs: typeof crvUsd.value | typeof pools.value) {
    return feesPerTimestamp(xs).map((x) => ({
      x: toCategory(x.timestamp),
      y: x.feesUsd,
    }));
  }

  const feesCrvUsd = {
    name: "crvusd",
    data: toDataPoints(crvUsd.value),
  };

  const feesPools = {
    name: "pools",
    data: toDataPoints(pools.value),
  };

  return [feesCrvUsd, feesPools];
});
</script>

<template>
  <Card
    title="Revenue breakdown by source"
    :loading
  >
    <template #actions-secondary>
      <Legend :items />
    </template>

    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  &:deep(.apexcharts-tooltip) {
    .apexcharts-tooltip-title {
      color: var(--c-text);
      background: transparent;
      border-bottom: 0;
    }
  }
}
</style>
