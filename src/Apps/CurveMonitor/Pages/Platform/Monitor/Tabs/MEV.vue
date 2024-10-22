<script setup lang="ts">
import LabelsWorstRelative from "@CM/Pages/Platform/Monitor/Components/LabelsWorstRelative.vue";
import LabelsWorstAbsolute from "@CM/Pages/Platform/Monitor/Components/LabelsWorstAbsolute.vue";
import Sandwiches from "@CM/Pages/Platform/Monitor/Components/Sandwiches.vue";
</script>

<template>
  <div class="dashboard-grid">
    <Sandwiches style="grid-area: sws" />

    <LabelsWorstRelative style="grid-area: relative" />
    <LabelsWorstAbsolute style="grid-area: absolute" />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "sws sws"
    "relative absolute";
}
</style>
