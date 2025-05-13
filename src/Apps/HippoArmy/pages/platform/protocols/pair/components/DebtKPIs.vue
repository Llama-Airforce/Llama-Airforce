<script setup lang="ts">
import type { DebtDistributionResponse } from "@HA/services/health/schema";

const { debt } = defineProps<{
  debt: DebtDistributionResponse | undefined;
}>();
</script>

<template>
  <div class="kpis">
    <KPI
      label="Max Debt"
      :has-value="!!debt?.maxDebt"
    >
      <AsyncValue
        type="dollar"
        :value="debt?.maxDebt"
        :precision="2"
        :show-symbol="false"
      />
    </KPI>

    <KPI
      label="Median Debt"
      :has-value="!!debt?.medianDebt"
    >
      <AsyncValue
        type="dollar"
        :value="debt?.medianDebt"
        :precision="2"
        :show-symbol="false"
      />
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--dashboard-gap);
}
</style>
