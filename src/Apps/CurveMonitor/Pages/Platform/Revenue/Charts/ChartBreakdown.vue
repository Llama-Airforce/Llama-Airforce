<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useQueryCrvUsdWeekly, useQueryPoolsWeekly } from "@CM/queries/revenue";

type Serie = {
  name: string;
  data: number[];
};

type YearOption = {
  id: number;
  label: string;
};

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
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: categories.value,
        labels: {
          formatter: (x: string): string => formatTimestamp(x),
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
        x: {
          formatter: (x: number): string => formatTimestamp(x, true),
        },
      },
    },
    ref({ colors, colorsArray })
  );
});

function toUtcDateTimestamp(timestamp: Date) {
  return (
    Date.UTC(
      timestamp.getUTCFullYear(),
      timestamp.getUTCMonth(),
      timestamp.getUTCDate()
    ) / 1000
  );
}

function feesPerTimestamp(xs: { timestamp: Date; feesUsd: number }[]) {
  return xs
    .groupBy((x) => toUtcDateTimestamp(x.timestamp))
    .entries()
    .map(([timestamp, xs]) => ({
      timestamp: Number(timestamp),
      feesUsd: xs.sumBy((x) => x.feesUsd),
    }))
    .orderBy((x) => x.timestamp, "asc");
}

const timestamps = computed((): number[] =>
  allTimestamps.value.filter(
    (timestamp) => !year.value || getUtcYear(timestamp) === year.value
  )
);

const allTimestamps = computed((): number[] => {
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
      // We want to start at the first occurrence of both crvUSD and pools data.
      .dropWhile((x) => x.numLabels < 2)
      .map((x) => x.timestamp)
  );
});

const yearOptions = computed((): YearOption[] =>
  allTimestamps.value
    .map((timestamp) => getUtcYear(timestamp))
    .uniq()
    .orderBy((x) => x, "desc")
    .map((year) => ({
      id: year,
      label: year.toString(),
    }))
);

// Filters
const year = ref<number>();

const selectedYear = computed(
  (): YearOption =>
    yearOptions.value.find((x) => x.id === year.value) ??
    yearOptions.value[0]
);

watchEffect(() => {
  if (yearOptions.value.length === 0) {
    return;
  }

  if (!yearOptions.value.some((x) => x.id === year.value)) {
    year.value = yearOptions.value[0].id;
  }
});

const categories = computed(() => timestamps.value);

const series = computed((): Serie[] => {
  function toDataPoints(xs: typeof crvUsd.value | typeof pools.value) {
    const feesByTimestamp = new Map(
      feesPerTimestamp(xs).map((x) => [x.timestamp, x.feesUsd])
    );

    return timestamps.value.map(
      (timestamp) => feesByTimestamp.get(timestamp) ?? 0
    );
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

function formatTimestamp(timestamp: number | string, includeYear = false) {
  const value = Number(timestamp);

  if (!Number.isFinite(value)) {
    return timestamp.toString();
  }

  return toCategory(value, includeYear);
}

function toCategory(timestamp: number, includeYear = false) {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  });
}

function getUtcYear(timestamp: number) {
  return new Date(timestamp * 1000).getUTCFullYear();
}
</script>

<template>
  <Card
    title="Revenue breakdown by source"
    :loading
  >
    <template #actions-secondary>
      <Legend :items />
    </template>

    <template #actions>
      <Select
        v-if="yearOptions.length > 0"
        class="year-select"
        :options="yearOptions"
        :selected="selectedYear"
        @select="year = $event.id"
      >
        <template #option="{ option }">
          {{ option.label }}
        </template>
      </Select>
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

.year-select {
  width: 6rem;
  z-index: 2;
}
</style>
