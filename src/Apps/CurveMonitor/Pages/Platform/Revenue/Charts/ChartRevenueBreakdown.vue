<template>
  <CardChart
    class="chart"
    :options
    :series
    :loading
    :title="t('title')"
  >
    <template #actions>
      <div class="actions">
        <Legend :items="legend"></Legend>

        <Tooltip placement="left">
          <div>{{ t("legend-explanation") }}</div>
        </Tooltip>
      </div>
    </template>
  </CardChart>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import { useQueryRevenueBreakdown } from "@CM/Services/Revenue/Queries";

type Serie = {
  name: string;
  data: { x: string; y: number }[];
};

const { t } = useI18n();

// Refs
const { theme } = storeToRefs(useSettingsStore());

const legend = computed(() => [
  {
    id: "dao",
    label: "DAO",
    color: theme.value.colorsArray[0],
  },
  {
    id: "lps",
    label: "Liquidity Providers",
    color: theme.value.colorsArray[1],
  },
]);

// Data
const { isFetching: loading, data: breakdown } = useQueryRevenueBreakdown();

// Chart
const options = computed(() => {
  const { colors, colorsArray } = {
    colors: theme.value.colors,
    colorsArray: [
      theme.value.colorsArray[0],
      shadeColor(theme.value.colorsArray[0], 10),
      shadeColor(theme.value.colorsArray[0], 20),
      theme.value.colorsArray[1],
      shadeColor(theme.value.colorsArray[1], 10),
    ],
  };

  return createChartStyles(
    { colors, colorsArray },
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
    }
  );
});

// Take the N latest weeks.
const weeks = computed((): number[] =>
  chain(breakdown.value)
    .groupBy((x) => x.week)
    .map((breakdowns) => ({
      week: breakdowns[0].week,
      numLabels: breakdowns.length,
    }))
    .orderBy((x) => x.week, "asc")
    // We want to start at the first occurance of crvUSD.
    .dropWhile((x) => x.numLabels < 3)
    .map((x) => x.week)
    .value()
);

const categories = computed((): string[] =>
  chain(weeks.value)
    .map((week) =>
      new Date(week * 1000).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .value()
);

const series = computed((): Serie[] =>
  chain(breakdown.value)
    .groupBy((x) => x.label)
    .map((breakdown, origin) => ({
      name: origin,
      // For each week, find the corresponding data if available, else zero.
      data: chain(weeks.value)
        .map((week) => ({
          week,
          breakdown: breakdown.find((x) => x.week === week),
        }))
        .map((x) => ({
          x: new Date(x.week * 1000).toLocaleDateString(),
          y: x.breakdown?.total_fees ?? 0,
        }))
        .value(),
    }))
    .orderBy((x) => x.name)
    .value()
);

// Methods
const formatterX = (x: string): string => x;

const formatterY = (y: number): string =>
  `$${round(y, 0, "dollar")}${unit(y, "dollar")}`;

const shadeColor = (hex: string, percent: number) => {
  // Parse the hex into RGB values
  let [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(
    (hex) => parseInt(hex, 16)
  );

  // Calculate the adjustment value
  const adjust = (amount: number, color: number) => {
    return Math.min(255, Math.max(0, color + Math.round(2.55 * amount)));
  };

  // Adjust each color component
  r = adjust(percent, r);
  g = adjust(percent, g);
  b = adjust(percent, b);

  // Convert the RGB values back to hex
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart {
  ::v-deep(.card-body) {
    .apexcharts-tooltip {
      grid-template-rows: auto auto;
      line-height: 0.25rem;

      .apexcharts-tooltip-title {
        color: var(--c-text);
        background: transparent;
        border-bottom: 0;
      }
    }
  }

  .actions {
    display: flex;
    gap: 2rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Revenue breakdown by source
legend-explanation:
  DAO revenue goes to veCRV lockers, Liquidity Provider revenue goes
  to people that LP
</i18n>
