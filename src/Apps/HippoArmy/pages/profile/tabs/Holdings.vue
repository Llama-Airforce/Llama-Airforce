<script setup lang="ts">
import { useSnapshots } from "@HA/queries/user";
import ChartCollateralRatio from "../charts/ChartCollateralRatio.vue";
import { useParams } from "../composables/useParams";
import TableHoldings from "../tables/TableHoldings.vue";

const { user, pairId } = useParams();

const { data: snapshots, isFetching: loading } = useSnapshots(
  computed(() => ({
    user_address: user.value!,
    pair_id: pairId.value,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <ChartCollateralRatio
      style="grid-area: chart"
      :snapshots
      :user
      :loading
    />

    <TableHoldings
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
