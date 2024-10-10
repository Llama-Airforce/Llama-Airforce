<script setup lang="ts">
import { useWallet } from "@/Wallet";
import ChartLocks from "../Charts/ChartLocks.vue";

import TableLocks from "../Tables/TableLocks.vue";
import TableGauges from "../Tables/TableGauges.vue";
import TableProposals from "../Tables/TableProposals.vue";

const wallet = useWallet();
const user = useRouteQuery<string>("user", wallet.address.value ?? "");
</script>

<template>
  <div class="dashboard-grid">
    <ChartLocks
      style="grid-area: locks-chart"
      :user
    />

    <TableLocks
      style="grid-area: locks-table"
      :user
    />

    <TableGauges
      style="grid-area: gauges"
      :user
    />

    <TableProposals
      style="grid-area: proposals"
      :user
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: minmax(250px, auto) minmax(250px, auto);
  grid-template-columns: 1.25fr 1fr 1.25fr;
  grid-template-areas:
    "proposals proposals gauges"
    "locks-table locks-chart locks-chart";

  > * {
    max-height: 600px;
  }

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
