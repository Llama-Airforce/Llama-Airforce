<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
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
    </template>

    <ChartCrvUsdSupplyLine v-if="chartType === 'line'"></ChartCrvUsdSupplyLine>
    <ChartCrvUsdSupplyBreakdown v-else></ChartCrvUsdSupplyBreakdown>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Card, ButtonToggle } from "@/Framework";
import ChartCrvUsdSupplyLine from "@CM/Pages/Platform/CrvUsd/Charts/ChartCrvUsdSupplyLine.vue";
import ChartCrvUsdSupplyBreakdown from "@CM/Pages/Platform/CrvUsd/Charts/ChartCrvUsdSupplyBreakdown.vue";

type ChartType = "line" | "breakdown";

const { t } = useI18n();

// Refs
const chartType = ref<ChartType>("line");

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

  .chart-types {
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
title: crvUSD Supply
</i18n>
