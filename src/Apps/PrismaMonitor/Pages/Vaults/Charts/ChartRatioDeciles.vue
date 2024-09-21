<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { ManagerService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

// Stores
const { flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-ratio-distribution"],
  queryFn: () =>
    managerService
      .getRatioDistributionGrouped("ethereum")
      .then((x) => x.deciles),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles({
    chart: {
      type: "bar",
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: formatterX,
        rotate: -60,
      },
      tickPlacement: "on",
    },
    yaxis: {
      labels: {
        formatter: formatterY,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
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
      intersect: true,
    },
  });
});

const categories = computed((): string[] => data.value.map((x) => x.label));

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("debt"),
    data: Object.values(data.value).map((x) => x.data),
  },
]);

// Methods
const formatterX = (x: string) => x;
const formatterY = (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`;
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
title: Debt per Collateral Ratio Deciles
debt: Debt
</i18n>
