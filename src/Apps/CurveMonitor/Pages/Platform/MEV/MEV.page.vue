<template>
  <div class="mev">
    <LabelsWorstRelative
      style="grid-row: 1; grid-column: 1"
    ></LabelsWorstRelative>

    <LabelsWorstAbsolute
      style="grid-row: 1; grid-column: 2"
    ></LabelsWorstAbsolute>

    <Sandwiches style="grid-row: 2; grid-column: 1 / -1"></Sandwiches>
  </div>
</template>

<script setup lang="ts">
import LabelsWorstRelative from "@CM/Pages/Platform/MEV/Components/LabelsWorstRelative.vue";
import LabelsWorstAbsolute from "@CM/Pages/Platform/MEV/Components/LabelsWorstAbsolute.vue";
import Sandwiches from "@CM/Pages/Platform/MEV/Components/Sandwiches.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("mev");

.mev {
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;
}
</style>
