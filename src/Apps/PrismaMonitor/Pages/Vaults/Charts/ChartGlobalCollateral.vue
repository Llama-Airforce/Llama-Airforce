<template>
  <CardGraph
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
  </CardGraph>
</template>

<script setup lang="ts">
import { createChartStyles } from "@/Styles/ChartStyles";
import { getHost, ManagerService, type Period } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

// Stores
const { theme, flavor } = storeToRefs(useSettingsStore());

// Services
const managerService = new ManagerService(getHost(), flavor.value);

// Data
const { loading, data, load } = usePromise(
  () =>
    managerService
      .getHistoricalCollateralOverview("ethereum", period.value)
      .then((x) => x.managers),
  []
);

// Refs
const period = ref<Period>("1m");

// eslint-disable-next-line max-lines-per-function
const options = computed(() => {
  return createChartStyles(theme.value, {
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
const formatterX = (x: string): string => x;
const formatterY = (y: number): string =>
  `$${round(y, 1, "dollar")}${unit(y, "dollar")}`;

// Events
const onPeriod = (newPeriod: Period) => {
  // Don't do anything if we're not changing the period.
  if (period.value === newPeriod) {
    return;
  }

  period.value = newPeriod;
};

// Watches
watch(period, load);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card-graph {
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
title: Collateral value
</i18n>
