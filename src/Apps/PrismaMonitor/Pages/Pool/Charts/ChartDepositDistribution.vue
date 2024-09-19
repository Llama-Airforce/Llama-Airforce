<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { useSettingsStore } from "@PM/Stores";
import { StabilityPoolService } from "@PM/Services";

const { t } = useI18n();

// Stores
const { flavor } = storeToRefs(useSettingsStore());

// Services
const sbService = new StabilityPoolService(flavor.value);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-distribution"],
  queryFn: () =>
    sbService.getStableDistribution("ethereum").then((x) => x.distribution),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles({
    chart: {
      id: "distribution",
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
        rotate: -45,
      },
      tickPlacement: "on",
    },
    legend: {
      inverseOrder: true,
    },
    stroke: {
      width: 0.5,
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

const series = computed((): { name: string; data: number[] }[] => [
  {
    name: t("numPos"),
    data: Object.values(data.value).map((x) => x.value),
  },
]);

const categories = computed(() => data.value.map((x) => x.label));
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
title: Distribution of current user deposits
numPos: "# of positions"
</i18n>
