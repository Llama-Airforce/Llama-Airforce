<script setup lang="ts">
import { useQueryCrvUsdSupply } from "@CM/Services/CrvUsd/Queries";
import {
  ChartCrvUsdSupplyLine,
  ChartCrvUsdSupplyBreakdown,
} from "@CM/Pages/Platform/CrvUsd/Charts";

type ChartType = "line" | "breakdown";

// Refs
const theme = useTheme();
const chartType = ref<ChartType>("line");

// Legend
const { items } = useLegend(() => [
  {
    id: "supply",
    label: "Supply",
    color: theme.value.colorsArray[0],
  },
  {
    id: "borrowed",
    label: "Borrowed",
    color: theme.value.colorsArray[1],
  },
]);

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

<template>
  <Card
    title="crvUSD Supply"
    :loading
  >
    <template #actions>
      <div class="chart-types button-group">
        <ButtonToggle
          :model-value="chartType === 'line'"
          @click="onChartType('line')"
        >
          Line
        </ButtonToggle>

        <ButtonToggle
          :model-value="chartType === 'breakdown'"
          @click="onChartType('breakdown')"
        >
          Breakdown
        </ButtonToggle>
      </div>
    </template>

    <template #actions-secondary>
      <Legend
        v-if="chartType === 'line'"
        :items
      ></Legend>
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

<style scoped>
.chart-types {
  display: flex;
  font-size: 0.875rem;
}
</style>
