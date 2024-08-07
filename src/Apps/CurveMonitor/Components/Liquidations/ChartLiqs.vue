<template>
  <Card
    class="chart-container"
    :title="t('title')"
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

    <ChartLiqsCount
      v-if="chartType === 'count'"
      :liqs
    ></ChartLiqsCount>

    <ChartLiqsValue
      v-else
      :liqs
    ></ChartLiqsValue>
  </Card>
</template>

<script setup lang="ts">
import { type LiquidationAggregate } from "@CM/Services/Liquidations";
import { ChartLiqsValue, ChartLiqsCount } from "@CM/Components/Liquidations";

type ChartType = "count" | "value";

const { t } = useI18n();

// Props
interface Props {
  liqs: LiquidationAggregate[];
}

const { liqs = [] } = defineProps<Props>();

// Refs
const chartType = ref<ChartType>("count");

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
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
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
