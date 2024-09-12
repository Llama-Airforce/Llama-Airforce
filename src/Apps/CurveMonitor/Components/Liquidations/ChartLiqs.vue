<script setup lang="ts">
import { type LiquidationAggregate } from "@CM/Services/Liquidations";
import { ChartLiqsValue, ChartLiqsCount } from "@CM/Components/Liquidations";

type ChartType = "count" | "value";

const { liqs = [] } = defineProps<{
  liqs: LiquidationAggregate[];
}>();

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

<template>
  <Card title="Self & Hard Liquidations">
    <template #actions>
      <div class="button-group">
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
