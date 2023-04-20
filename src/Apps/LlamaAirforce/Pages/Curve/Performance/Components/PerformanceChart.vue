<template>
  <CardGraph
    class="performance-chart"
    :title="t('title')"
    :options="options"
    :series="series"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { CardGraph } from "@/Framework";
import createChartStyles from "@/Styles/ChartStyles";
import { round, unit } from "@/Util";
import { PoolPerformanceResponse } from "@LAF/Pages/Curve/Performance/Services/PerformanceService";

const { t } = useI18n();

type Serie = {
  name: string;
  type: string;
  data: { x: number; y: number }[];
};

// Props
interface Props {
  data: PoolPerformanceResponse;
}

const { data = new PoolPerformanceResponse() } = defineProps<Props>();

const options = computed((): unknown => {
  return createChartStyles({
    chart: {
      id: "performance",
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      type: "datetime",
    },
    stroke: {
      width: [1, 2, 2, 2],
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (y: number): string => formatter(y),
      },
    },
    plotOptions: {
      bar: {
        distributed: false,
        dataLabels: {
          position: "top",
          hideOverflowingLabels: false,
        },
      },
    },
  });
});

function transformSeries(input: PoolPerformanceResponse): Serie[] {
  return [
    {
      name: "HODL",
      type: "line",
      data: input.returns.map((item) => {
        return { y: item.hodl, x: item.timestamp * 1000 };
      }),
    },
    {
      name: "Curve Base",
      type: "line",
      data: input.returns.map((item) => {
        return { y: item.curve, x: item.timestamp * 1000 };
      }),
    },
    {
      name: "Zero Fee XYK",
      type: "line",
      data: input.returns.map((item) => {
        return { y: item.xyk, x: item.timestamp * 1000 };
      }),
    },
    {
      name: "CRV & CVX Rewards",
      type: "line",
      data: input.returns.map((item) => {
        return { y: item.curve_rewards, x: item.timestamp * 1000 };
      }),
    },
  ];
}

const series = computed((): Serie[] => {
  if (data.returns) {
    const test = transformSeries(data);
    return test;
  }
  return [];
});

const formatter = (x: number): string => {
  return `${x < 0 ? "-" : ""}$${round(Math.abs(x), 1, "dollar")}${unit(
    x,
    "dollar"
  )}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.performance-chart {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    height: 400px;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Impermanent Loss & Rewards
</i18n>
