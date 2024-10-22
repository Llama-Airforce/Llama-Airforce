<script setup lang="ts">
import { type PoolDepth } from "@PM/Services";
import { createChartStyles } from "@/Styles/ChartStylesApex";

const { t } = useI18n();

const { depth = null, loading } = defineProps<{
  depth?: PoolDepth | null;
  loading: boolean;
}>();

// Refs
const theme = useTheme();

const options = computed(() => {
  const { colors } = theme.value;

  return createChartStyles({
    chart: {
      type: "area",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    toolbar: {
      show: false,
    },
    xaxis: {
      type: "numeric",
      labels: {
        formatter: (x: number): string => formatter(x),
      },
    },
    yaxis: {
      seriesName: "amounts",
      labels: {
        formatter: (y: number): string => formatter(y),
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        formatter: (y: number): string => formatter(y),
      },
    },
    colors: [
      (x: { value: number }) => {
        if (x.value === 0) {
          return colors.blue;
        } else {
          return colors.green;
        }
      },
      (x: { value: number }) => {
        if (x.value === 0) {
          return colors.blue;
        } else {
          return colors.red;
        }
      },
    ],
  });
});

const series = computed(
  (): { name: string; data: { x: number; y: number }[] }[] => {
    if (!depth) return [];

    const bidSeries = [
      ...depth.ask.prices.map((price) => {
        return {
          x: price,
          y: 0,
        };
      }),
      ...depth.bid.prices.map((price, index) => {
        return {
          x: price,
          y: depth.bid.amounts[index],
        };
      }),
    ];

    const askSeries = [
      ...depth.ask.prices.map((price, index) => {
        return {
          x: price,
          y: depth.ask.amounts[index],
        };
      }),
    ];

    return [
      {
        name: "Bid",
        data: bidSeries,
      },
      {
        name: "Ask",
        data: askSeries,
      },
    ];
  }
);

const title = computed(() => {
  if (!depth?.tokens || depth.tokens.length === 0) {
    return t("title");
  }

  const tokensString = depth.tokens.join(" / ");
  return `${t("title")} - ${tokensString} (Curve)`;
});

const formatter = (x: number) => {
  return `$${round(Math.abs(x), 2, "dollar")}${unit(x)}`;
};
</script>

<template>
  <Card
    :title
    :loading
  >
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
title: Liquidity Depth
</i18n>
