<script setup lang="ts">
import TableFeesCollected from "@CM/Pages/Platform/Revenue/Tables/TableFeesCollected.vue";
import TableFeesStaged from "@CM/Pages/Platform/Revenue/Tables/TableFeesStaged.vue";
import {
  useQueryFeesCollected,
  useQueryFeesStaged,
} from "@CM/Services/Revenue/Queries";

const { isFetching: loadingCollected, data: feesCollected } =
  useQueryFeesCollected();

const { isFetching: loadingStaged, data: feesStaged } = useQueryFeesStaged();
</script>

<template>
  <div class="harvesting">
    <TableFeesCollected
      style="grid-area: collected"
      :fees="feesCollected"
      :loading="loadingCollected"
    ></TableFeesCollected>

    <TableFeesStaged
      style="grid-area: staged"
      :fees="feesStaged"
      :loading="loadingStaged"
    ></TableFeesStaged>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.harvesting {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 900px;
  grid-template-areas: "collected staged";
}
</style>
