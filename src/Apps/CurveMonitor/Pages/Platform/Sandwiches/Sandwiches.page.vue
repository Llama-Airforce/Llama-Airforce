<script setup lang="ts">
import LabelsWorstRelative from "./Components/LabelsWorstRelative.vue";
import LabelsWorstAbsolute from "./Components/LabelsWorstAbsolute.vue";
import Sandwiches from "./Components/Sandwiches.vue";
</script>

<template>
  <div class="dashboard">
    <Sandwiches style="grid-area: sws" />

    <LabelsWorstRelative style="grid-area: relative" />
    <LabelsWorstAbsolute style="grid-area: absolute" />
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "sws sws"
    "relative absolute";
}
</style>
