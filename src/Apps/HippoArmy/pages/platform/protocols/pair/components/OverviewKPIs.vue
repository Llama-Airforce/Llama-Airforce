<script setup lang="ts">
import type { Pair } from "@HA/services/protocols/schema";
import TooltipApr from "./TooltipApr.vue";

const { pair } = defineProps<{
  pair: Pair;
}>();
</script>

<template>
  <div class="kpis">
    <KPI
      label="Positions"
      :has-value="!!pair"
    >
      <AsyncValue
        :precision="0"
        :value="pair?.activePositionsCount"
      />
    </KPI>

    <KPI
      label="TVL"
      :has-value="!!pair"
    >
      <AsyncValue
        type="dollar"
        :precision="2"
        :value="pair?.totalUnderlying"
        :show-symbol="false"
      />
      {{ pair.tokenPairUnderyling.symbol }}
    </KPI>

    <KPI
      label="Debt"
      :has-value="!!pair"
    >
      <AsyncValue
        type="dollar"
        :precision="2"
        :value="pair?.totalDebt"
        :show-symbol="false"
      />
      {{ pair.tokenDebt.symbol }}
    </KPI>

    <KPI
      label="Borrow Rate / Reward Rate"
      :has-value="!!pair"
    >
      <div class="two-sides">
        <AsyncValue
          type="percentage"
          :precision="2"
          :value="pair?.aprBorrowCost"
        />

        <TooltipApr :pair />
      </div>
    </KPI>

    <KPI
      label="Utilization Rate"
      :has-value="!!pair"
    >
      <AsyncValue
        type="percentage"
        :precision="2"
        :value="pair?.utilizationRate"
      />
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--dashboard-gap);
}

.two-sides {
  flex-grow: 1;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
</style>
