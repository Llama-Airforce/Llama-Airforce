<script setup lang="ts">
import { useWallet } from "@/Wallet";
import type { Chain } from "@/Framework/Chain";
import TableMarketsLending from "../Tables/TableMarketsLending.vue";
import TableMarketEvents from "../Tables/TableMarketEvents.vue";
import ChartSnapshots from "../Charts/ChartSnapshots.vue";

// User
const wallet = useWallet();
const user = useRouteQuery<string>("user", wallet.address.value ?? "");
const chain = useRouteQuery<Chain>("chain", "ethereum");
const controller = useRouteQuery<string | undefined>("controller", undefined);
</script>

<template>
  <div class="dashboard-grid">
    <TableMarketsLending
      style="grid-area: markets"
      :user
    />

    <TableMarketEvents
      v-if="controller"
      style="grid-area: events"
      type="lending"
      :user
      :chain
      :controller
    />

    <ChartSnapshots
      v-if="controller"
      style="grid-area: snapshots"
      type="lending"
      :user
      :chain
      :controller
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: minmax(250px, auto) minmax(250px, 500px);
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "markets markets"
    "events snapshots";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;

    > * {
      max-height: 600px;
    }
  }
}
</style>
