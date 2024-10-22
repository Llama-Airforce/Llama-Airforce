<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { ManagerService, type Period } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

// Stores
const { flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(flavor.value);

// Refs
const period = ref<Period>("1m");

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-collateral-hist-overview", period] as const,
  queryFn: ({ queryKey: [, period] }) =>
    managerService
      .getHistoricalCollateralOverview("ethereum", period)
      .then((x) => x.managers),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles({
    chart: {
      type: "area",
      stacked: "true",
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

    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
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
    },
  });
});

const categories = computed((): string[] => {
  if (data.value.length === 0 || data.value[0].data.length === 0) {
    return [];
  }

  return data.value[0].data.map((point) => {
    return new Date(point.timestamp * 1000).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
    });
  });
});

const series = computed(() => {
  if (data.value.length === 0) {
    return [];
  }

  return data.value.map((managerData) => {
    return {
      name: managerData.manager,
      data: managerData.data.map((point) => point.value),
    };
  });
});

// Methods
const formatterX = (x: string) => x;
const formatterY = (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`;

// Events
const onPeriod = (newPeriod: Period) => {
  // Don't do anything if we're not changing the period.
  if (period.value === newPeriod) {
    return;
  }

  period.value = newPeriod;
};
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="button-group">
        <ButtonToggle
          :model-value="period === '1m'"
          @click="onPeriod('1m')"
        >
          1m
        </ButtonToggle>

        <ButtonToggle
          :model-value="period === '3m'"
          @click="onPeriod('3m')"
        >
          3m
        </ButtonToggle>

        <ButtonToggle
          :model-value="period === '6m'"
          @click="onPeriod('6m')"
        >
          6m
        </ButtonToggle>
      </div>
    </template>

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
title: Collateral value
</i18n>
