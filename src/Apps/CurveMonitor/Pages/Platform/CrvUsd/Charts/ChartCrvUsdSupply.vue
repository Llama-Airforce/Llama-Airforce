<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import { useQueryCrvUsdSupply } from "@CM/Services/CrvUsd/Queries";
import {
  ChartCrvUsdSupplyLine,
  ChartCrvUsdSupplyBreakdown,
} from "@CM/Pages/Platform/CrvUsd/Charts";

type ChartType = "line" | "breakdown";

// Refs
const { theme } = storeToRefs(useSettingsStore());
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
      <div class="actions">
        <Legend
          v-if="chartType === 'line'"
          :items
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card {
  --header-columns: auto 1fr;
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
</style>
