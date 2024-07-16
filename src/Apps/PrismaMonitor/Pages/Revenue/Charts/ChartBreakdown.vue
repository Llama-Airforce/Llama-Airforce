<template>
  <CardChart
    class="graph"
    :title="t('title')"
    :options="options"
    :series="series"
    :loading="loading"
  >
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@PM/Stores";
import { RevenueService } from "@PM/Services";

const { t } = useI18n();

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const revenueService = new RevenueService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-revenue-breakdown"],
  queryFn: () => revenueService.getBreakdown(),
  initialData: {
    unlock_penalty: 0,
    borrowing_fees: 0,
    redemption_fees: 0,
  },
  initialDataUpdatedAt: 0,
});

// Refs
const options = computed(() => {
  return createChartStyles(theme.value, {
    chart: {
      id: "breakdown",
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
        const data = [
          `<div><b>${address}</b>:</div><div>${formatter(value)}</div>`,
        ];

        return data.join("");
      },
    },
    labels: categories.value,
  });
});

const series = computed(() => [
  data.value.unlock_penalty,
  data.value.borrowing_fees,
  data.value.redemption_fees,
]);

const categories = computed(() => [
  t("unlockPenalty"),
  t("borrowingFees"),
  t("redemptionFees"),
]);

// Methods
const formatter = (x: number): string =>
  `$${round(x, 2, "percentage")}${unit(x, "percentage")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.graph {
  :deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }

    .apexcharts-tooltip {
      grid-template-rows: auto auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Breakdown
unlockPenalty: Unlock penalty
borrowingFees: Borrowing fees
redemptionFees: Redemption fees
</i18n>
