<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <Legend
          v-if="chartType === 'line'"
          :items="['Supply', 'Borrowed']"
          :colors="theme.colorsArray"
        ></Legend>

        <div class="chart-types">
          <ButtonToggle
            value="Line"
            :model-value="chartType === 'line'"
            @click="onChartType('line')"
          >
          </ButtonToggle>

          <ButtonToggle
            value="Breakdown"
            :model-value="chartType === 'breakdown'"
            @click="onChartType('breakdown')"
          >
          </ButtonToggle>
        </div>
      </div>
    </template>

    <KeepAlive>
      <ChartCrvUsdSupplyLine
        v-if="chartType === 'line'"
        :data="data"
      ></ChartCrvUsdSupplyLine>
    </KeepAlive>

    <KeepAlive>
      <ChartCrvUsdSupplyBreakdown
        v-if="chartType === 'breakdown'"
        :data="data"
      ></ChartCrvUsdSupplyBreakdown>
    </KeepAlive>
  </Card>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import { useQueryCrvUsdSupply } from "@CM/Services/CrvUsd/Queries";
import {
  ChartCrvUsdSupplyLine,
  ChartCrvUsdSupplyBreakdown,
} from "@CM/Pages/Platform/CrvUsd/Charts";

type ChartType = "line" | "breakdown";

const { t } = useI18n();

// Refs
const { theme } = storeToRefs(useSettingsStore());

const chartType = ref<ChartType>("line");

// Data
const { isFetching: loading, data } = useQueryCrvUsdSupply();

// Events
const onChartType = (type: ChartType) => {
  // Don't do anything if we're not changing the type.
  if (chartType.value === type) {
    return;
  }

  chartType.value = type;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  .actions {
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;

    .legend {
      grid-column: 1;
      justify-self: center;
    }

    .chart-types {
      grid-column: 2;

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
}
</style>

<i18n lang="yaml" locale="en">
title: crvUSD Supply
</i18n>
