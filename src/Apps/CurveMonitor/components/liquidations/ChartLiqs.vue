<script setup lang="ts">
import type { LiquidationAggregate } from "@curvefi/prices-api/liquidations";
import { ChartLiqsValue, ChartLiqsCount } from "@CM/components/liquidations";

type ChartType = "count" | "value";

const { liqs } = defineProps<{
  liqs: LiquidationAggregate[];
}>();

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

<template>
  <Card title="Self & Hard Liquidations">
    <template #actions>
      <div class="button-group">
        <ButtonToggle
          :model-value="chartType === 'count'"
          @click="onChartType('count')"
        >
          Count
        </ButtonToggle>

        <ButtonToggle
          :model-value="chartType === 'value'"
          @click="onChartType('value')"
        >
          Value
        </ButtonToggle>
      </div>
    </template>

    <ChartLiqsCount
      v-if="chartType === 'count'"
      :liqs
    />

    <ChartLiqsValue
      v-else
      :liqs
    />
  </Card>
</template>
