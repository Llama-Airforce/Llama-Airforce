<script setup lang="ts">
import type { CollateralRatioDistributionResponse } from "@HA/services/health/schema";

const { collateralRatio } = defineProps<{
  collateralRatio: CollateralRatioDistributionResponse | undefined;
}>();

const mostCommonCollateralRatio = computed(() => {
  if (!collateralRatio || collateralRatio.bins.length === 0) return undefined;

  const maxUserBin = [...collateralRatio.bins].sort(
    (a, b) => b.userCount - a.userCount
  )[0];

  const [min, max] = maxUserBin.rangeLabel.split(" - ").map(parseFloat);
  const formattedRange = `${Math.round(min * 100)}% - ${Math.round(
    max * 100
  )}%`;

  return {
    range: formattedRange,
    users: maxUserBin.userCount,
  };
});
</script>

<template>
  <div class="kpis">
    <KPI
      label="Median Collateral Ratio"
      :has-value="!!collateralRatio?.medianRatio"
    >
      <AsyncValue
        type="percentage"
        :value="
          collateralRatio?.medianRatio ? collateralRatio.medianRatio * 100 : '?'
        "
        :precision="2"
      />
    </KPI>

    <KPI
      label="Most Common Collateral Ratio"
      :has-value="!!mostCommonCollateralRatio"
    >
      <div>{{ mostCommonCollateralRatio?.range ?? "N/A" }}</div>
      <div class="kpi-subvalue">
        <AsyncValue
          :value="mostCommonCollateralRatio?.users ?? '?'"
          :precision="0"
        />
        users
      </div>
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--dashboard-gap);
}

.kpi-subvalue {
  display: flex;
  gap: 1ch;
  font-size: 0.75rem;
  opacity: 0.75;
}
</style>
