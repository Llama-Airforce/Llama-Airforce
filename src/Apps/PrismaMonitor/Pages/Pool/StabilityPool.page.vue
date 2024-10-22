<script setup lang="ts">
import ChartPoolTvl from "@PM/Pages/Pool/Charts/ChartPoolTvl.vue";
import ChartStableFlow from "@PM/Pages/Pool/Charts/ChartStableFlow.vue";
import ChartDepositDistribution from "@PM/Pages/Pool/Charts/ChartDepositDistribution.vue";
import ChartCumulativeWithdrawals from "@PM/Pages/Pool/Charts/ChartCumulativeWithdrawals.vue";
import TableTopDeposits from "@PM/Pages/Pool/Tables/TableTopDeposits.vue";
import TableTopWithdrawals from "@PM/Pages/Pool/Tables/TableTopWithdrawals.vue";
</script>

<template>
  <div class="dashboard">
    <ChartPoolTvl />
    <ChartStableFlow />
    <ChartDepositDistribution />
    <ChartCumulativeWithdrawals />
    <TableTopDeposits />
    <TableTopWithdrawals />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr auto;
}
</style>
