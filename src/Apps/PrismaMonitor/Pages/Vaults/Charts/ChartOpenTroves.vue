<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStylesApex";
import { ManagerService, type Period } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

type TooltipParams = {
  series: number[][];
  dataPointIndex: number;
  w: { globals: { seriesNames: string[] } };
};

// Stores
const { flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(flavor.value);

// Refs
const period = ref<Period>("1m");

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-historical-open-troves", period] as const,
  queryFn: ({ queryKey: [, period] }) =>
    managerService
      .getHistoricalOpenTrovesOverview("ethereum", period)
      .then((x) => x.managers),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const options = computed(() => {
  return createChartStyles({
    chart: {
      type: "bar",
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
      custom: ({ series, dataPointIndex, w }: TooltipParams) => {
        let total = 0;
        const data = series.map((managerSeries, index) => {
          const value = managerSeries[dataPointIndex];
          total += value;
          return `<div><b>${w.globals.seriesNames[index]}</b>: ${value}</div>`;
        });

        // Add total
        data.push(`<div><b>Total</b>: ${total}</div>`);

        return data.join("");
      },
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

<i18n lang="yaml" locale="en">
title: Open troves
</i18n>
