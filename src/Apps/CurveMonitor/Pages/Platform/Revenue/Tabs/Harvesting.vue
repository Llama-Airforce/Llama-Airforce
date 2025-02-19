<script setup lang="ts">
import { useQueryFeesCollected, useQueryFeesStaged } from "@CM/queries/revenue";
import TableFeesCollected from "../Tables/TableFeesCollected.vue";
import TableFeesStaged from "../Tables/TableFeesStaged.vue";

const { isFetching: loadingCollected, data: feesCollected } =
  useQueryFeesCollected();

const { isFetching: loadingStaged, data: feesStaged } = useQueryFeesStaged();
</script>

<template>
  <div class="dashboard-grid">
    <TableFeesCollected
      style="grid-area: collected"
      :fees="feesCollected"
      :loading="loadingCollected"
    />

    <TableFeesStaged
      style="grid-area: staged"
      :fees="feesStaged"
      :loading="loadingStaged"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 900px;
  grid-template-areas: "collected staged";
}
</style>
