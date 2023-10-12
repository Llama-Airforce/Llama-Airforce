<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <div class="chart-types">
          <ButtonToggle
            value="Count"
            :model-value="chartType === 'count'"
            @click="onChartType('count')"
          >
          </ButtonToggle>

          <ButtonToggle
            value="Value"
            :model-value="chartType === 'value'"
            @click="onChartType('value')"
          >
          </ButtonToggle>
        </div>
      </div>
    </template>

    <ChartLiquidationHistoricalCount
      v-if="chartType === 'count'"
      :data="data"
    ></ChartLiquidationHistoricalCount>

    <ChartLiquidationHistoricalValue
      v-else
      :data="data"
    ></ChartLiquidationHistoricalValue>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Card, ButtonToggle, useData } from "@/Framework";
import CurveService, {
  type Market,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import ChartLiquidationHistoricalValue from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationHistoricalValue.vue";
import ChartLiquidationHistoricalCount from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationHistoricalCount.vue";
import { getHost } from "@/Services/Host";

type ChartType = "count" | "value";

const { t } = useI18n();
const curveService = new CurveService(getHost());

// Refs
const chartType = ref<ChartType>("count");

// Props
interface Props {
  market?: Market | null;
}
const { market = null } = defineProps<Props>();

// Data
const { loading, data, loadData } = useData(() => {
  if (market) {
    return curveService
      .getHistoricalLiquidations(market.address)
      .then((x) => x.liquidations);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Watches
watch(() => market, loadData, { immediate: true });

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
title: Self & Hard Liquidations
</i18n>
