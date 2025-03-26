<script setup lang="ts">
import { useSnapshots } from "@HA/queries/user";
import ChartInterestAccrued from "../charts/ChartInterestAccrued.vue";
import TableAnalytics from "../tables/TableAnalytics.vue";

const { address } = useAccount();
const user = useRouteQuery<string>("user", address.value ?? "");
const pairId = useRouteQuery<number | undefined>("pairId", undefined, {
  transform: Number,
});

const { data: snapshots, isFetching: loading } = useSnapshots(
  computed(() => ({
    user_address: user.value,
    pair_id: pairId.value,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <ChartInterestAccrued
      style="grid-area: chart"
      :snapshots
      :user
      :loading
    />

    <TableAnalytics
      style="grid-area: table"
      :snapshots
      :user
      :loading
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "chart"
    "table";

  > * {
    max-height: 600px;
  }

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
