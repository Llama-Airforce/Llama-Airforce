<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useSettingsStore } from "@PM/Stores";
import { StableService } from "@PM/Services";
import { addressShort } from "@/Wallet";

const { t } = useI18n();

// Stores
const { flavor } = storeToRefs(useSettingsStore());

// Services
const stableService = new StableService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-holders"],
  queryFn: () =>
    stableService.getLargeStableCoinHolders("ethereum").then((x) => x.holders),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles({
    chart: {
      id: "mainHolders",
      type: "donut",
      animations: {
        enabled: false,
      },
    },
    legend: {
      inverseOrder: true,
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
        let label = categories.value[x.seriesIndex];
        label =
          label.length > 10 && label.startsWith("0x")
            ? addressShort(label)
            : label;
        const value = x.series[x.seriesIndex];
        const data = [
          `<div><b>${label}</b>:</div><div>${formatter(
            value as unknown as number
          )}</div>`,
        ];

        return data.join("");
      },
    },
    labels: data.value.map((x) =>
      x.label.length > 10 && x.label.startsWith("0x")
        ? addressShort(x.label)
        : x.label
    ),
  });
});

const series = computed(() => data.value.map((x) => x.value));

const categories = computed(() => data.value.map((x) => x.label));

// Methods
const formatter = (x: number): string =>
  `$${round(Math.abs(x), 1, "dollar")}${unit(x)}`;
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <ChartApex
      :options
      :series
    ></ChartApex>
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>

<i18n lang="yaml" locale="en">
title: Largest holders
</i18n>
