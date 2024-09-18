<script setup lang="ts">
import TableTransfers from "../Tables/TableTransfers.vue";
import CommunityLists from "../Components/CommunityLists.vue";
</script>

<template>
  <div class="dashboard-grid">
    <CommunityLists style="grid-area: lists"></CommunityLists>
    <TableTransfers style="grid-area: transfers"></TableTransfers>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: auto;
  grid-template-areas:
    "lists"
    "transfers";
}
</style>
