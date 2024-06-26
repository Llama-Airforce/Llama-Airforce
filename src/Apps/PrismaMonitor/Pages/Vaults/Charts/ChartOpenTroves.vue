<template>
  <CardChart
    class="chart"
    :title="t('title')"
    :loading="loading"
    :options="options"
    :series="series"
  >
    <template #actions>
      <div class="actions">
        <div class="periods">
          <ButtonToggle
            value="1m"
            :model-value="period === '1m'"
            @click="onPeriod('1m')"
          >
          </ButtonToggle>

          <ButtonToggle
            value="3m"
            :model-value="period === '3m'"
            @click="onPeriod('3m')"
          >
          </ButtonToggle>

          <ButtonToggle
            value="6m"
            :model-value="period === '6m'"
            @click="onPeriod('6m')"
          >
          </ButtonToggle>
        </div>
      </div>
    </template>
  </CardChart>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { ManagerService, type Period } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

type TooltipParams = {
  series: number[][];
  dataPointIndex: number;
  w: { globals: { seriesNames: string[] } };
};

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(useHost(), flavor.value);

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
  return createChartStyles(theme.value, {
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
const formatterX = (x: string): string => x;

// Events
const onPeriod = (newPeriod: Period) => {
  // Don't do anything if we're not changing the period.
  if (period.value === newPeriod) {
    return;
  }

  period.value = newPeriod;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.cart-chart {
  ::v-deep(.card-body) {
    @media only screen and (max-width: 1280px) {
      height: 300px;
    }
  }
}

.actions {
  .periods {
    display: flex;
    font-size: 0.875rem;

    button {
      &:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Open troves
</i18n>
