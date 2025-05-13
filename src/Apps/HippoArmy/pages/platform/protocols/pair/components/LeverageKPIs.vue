<script setup lang="ts">
import type {
  LeverageDistributionResponse,
  LeverageStatsResponse,
} from "@HA/services/health/schema";

const { leverage, leverageStats } = defineProps<{
  leverage: LeverageDistributionResponse | undefined;
  leverageStats: LeverageStatsResponse | undefined;
}>();

const mostCommonLeverage = computed(() => {
  if (!leverage || leverage.bins.length === 0) return undefined;

  const maxUserBin = [...leverage.bins].sort(
    (a, b) => b.userCount - a.userCount
  )[0];

  return {
    range: maxUserBin.rangeLabel,
    users: maxUserBin.userCount,
  };
});

const highestDebtLeverage = computed(() => {
  if (!leverage || leverage.bins.length === 0) return undefined;

  const maxDebtBin = [...leverage.bins].sort(
    (a, b) => b.totalDebt - a.totalDebt
  )[0];

  return {
    range: maxDebtBin.rangeLabel,
    debt: maxDebtBin.totalDebt,
  };
});
</script>

<template>
  <div class="kpis">
    <KPI
      label="Most Common Range"
      :has-value="!!mostCommonLeverage"
    >
      <div>{{ mostCommonLeverage?.range ?? "N/A" }}</div>
      <div class="kpi-subvalue">
        <AsyncValue
          :value="mostCommonLeverage?.users ?? '?'"
          :precision="0"
        />
        users
      </div>
    </KPI>

    <KPI
      label="Highest Debt Range"
      :has-value="!!highestDebtLeverage"
    >
      <div>{{ highestDebtLeverage?.range }}</div>
      <div class="kpi-subvalue">
        <AsyncValue
          type="dollar"
          :value="highestDebtLeverage?.debt"
          :precision="2"
        />
      </div>
    </KPI>

    <KPI
      label="Leveraged Users"
      :has-value="!!leverageStats?.stats"
    >
      <AsyncValue
        :value="leverageStats?.stats.leveragedUsersCount"
        :precision="0"
      />
      <div class="kpi-subvalue">
        <AsyncValue
          type="percentage"
          :value="leverageStats?.stats.leveragedUsersPercentage"
          :precision="2"
        />
        of total
      </div>
    </KPI>

    <KPI
      label="Leveraged Debt"
      :has-value="!!leverageStats?.stats"
    >
      <AsyncValue
        type="dollar"
        :value="leverageStats?.stats.leveragedDebt"
        :precision="2"
        :show-symbol="false"
      />
      <div class="kpi-subvalue">
        <AsyncValue
          type="percentage"
          :value="leverageStats?.stats.leveragedDebtPercentage"
          :precision="2"
        />
        of total
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
