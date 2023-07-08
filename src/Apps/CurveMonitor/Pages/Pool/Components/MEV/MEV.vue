<template>
  <div class="mev">
    <LabelsBest style="grid-row: 1; grid-column: 1"></LabelsBest>
    <LabelsWorst style="grid-row: 1; grid-column: 2"></LabelsWorst>

    <Sandwiches style="grid-row: 2; grid-column: 1 / -1"></Sandwiches>
  </div>
</template>

<script setup lang="ts">
import LabelsBest from "@CM/Pages/Pool/Components/MEV/LabelsBest.vue";
import LabelsWorst from "@CM/Pages/Pool/Components/MEV/LabelsWorst.vue";
import Sandwiches from "@CM/Pages/Pool/Components/MEV/Sandwiches.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.mev {
  display: grid;
  gap: var(--dashboard-gap);

  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;

  margin: var(--dashboard-gap) 0;
}
</style>
