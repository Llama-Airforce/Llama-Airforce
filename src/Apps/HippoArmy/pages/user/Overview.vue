<script setup lang="ts">
import { usePairsEthereum } from "@HA/queries/protocols";
import { useSnapshots } from "@HA/queries/user";
import ChartCollateralRatio from "./charts/ChartCollateralRatio.vue";
import ChartPosition from "./charts/ChartPosition.vue";
import { useParams } from "./composables/useParams";
import TableSnapshots from "./tables/TableSnapshots.vue";

const { user, pairId } = useParams();

const { data: snapshots, isFetching: loading } = useSnapshots(
  computed(() => ({
    user_address: user.value!,
    pair_id: pairId.value,
  }))
);

const { data: allPairs } = usePairsEthereum();
const pair = computed(() =>
  allPairs.value.find((pair) => pair.pairId === pairId.value)
);
</script>

<template>
  <div class="dashboard-grid">
    <ChartPosition
      style="grid-area: chart-position"
      :snapshots
      :user
      :loading
    />

    <ChartCollateralRatio
      style="grid-area: chart-ratio"
      :snapshots
      :user
      :loading
    />

    <TableSnapshots
      v-if="pair"
      style="grid-area: table"
      :snapshots
      :user
      :pair
      :loading
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "chart-position chart-ratio"
    "table table";

  > * {
    max-height: 600px;
  }

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
