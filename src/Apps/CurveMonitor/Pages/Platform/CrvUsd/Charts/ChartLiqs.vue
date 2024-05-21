<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading
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
      :data
    ></ChartLiqsCount>

    <ChartLiqsValue
      v-else
      :data
    ></ChartLiqsValue>
  </Card>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/CrvUsd";
import { useQueryLiqsAggregate } from "@CM/Services/CrvUsd/Queries";
import {
  ChartLiqsValue,
  ChartLiqsCount,
} from "@CM/Pages/Platform/CrvUsd/Charts";

type ChartType = "count" | "value";

const { t } = useI18n();

// Refs
const chartType = ref<ChartType>("count");

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}
const { market, chain } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQueryLiqsAggregate(
  toRef(() => chain),
  toRef(() => market)
);

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
