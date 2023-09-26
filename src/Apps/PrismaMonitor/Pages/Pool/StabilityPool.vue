<template>
  <div class="pool">
    <ChartPoolTvl></ChartPoolTvl>
    <ChartStableFlow></ChartStableFlow>
    <ChartDepositDistribution></ChartDepositDistribution>
    <ChartCumulativeWithdrawals></ChartCumulativeWithdrawals>
    <TableTopDeposits></TableTopDeposits>
    <TableTopWithdrawals></TableTopWithdrawals>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useBreadcrumbStore } from "@PM/Stores/BreadcrumbStore";
import ChartPoolTvl from "@PM/Pages/Pool/Charts/ChartPoolTvl.vue";
import ChartStableFlow from "@PM/Pages/Pool/Charts/ChartStableFlow.vue";
import ChartDepositDistribution from "@PM/Pages/Pool/Charts/ChartDepositDistribution.vue";
import ChartCumulativeWithdrawals from "@PM/Pages/Pool/Charts/ChartCumulativeWithdrawals.vue";
import TableTopDeposits from "@PM/Pages/Pool/Tables/TableTopDeposits.vue";
import TableTopWithdrawals from "@PM/Pages/Pool/Tables/TableTopWithdrawals.vue";

// Refs
const storeBreadcrumb = useBreadcrumbStore();

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "pool",
      label: "Stability Pool",
      pathName: "pool",
    },
  ];
});


</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pool");

.pool {
  max-width: calc(1920px - 18.125rem);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
