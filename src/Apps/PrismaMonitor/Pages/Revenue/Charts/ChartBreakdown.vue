<template>
  <CardGraph
    class="graph"
    :title="t('title')"
    :options="options"
    :series="series"
    :loading="loading"
  >
  </CardGraph>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore } from "@PM/Stores";
import { getHost, RevenueService } from "@PM/Services";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const revenueService = new RevenueService(getHost(), storeSettings.flavor);

// Data
const { loading, data } = usePromise(() => revenueService.getBreakdown(), {
  unlock_penalty: 0,
  borrowing_fees: 0,
  redemption_fees: 0,
});

// Refs
const options = computed((): unknown => {
  const colors = getColors(storeSettings.theme, storeSettings.flavor);
  const colorsArray = getColorsArray(storeSettings.theme, storeSettings.flavor);

  return createChartStyles(
    { colors, colorsArray },
    {
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
    }
  );
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
  ::v-deep(.card-body) {
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
