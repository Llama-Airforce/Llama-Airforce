<script setup lang="ts">
import ChartBreakdown from "@CM/Pages/Platform/Revenue/Charts/ChartBreakdown.vue";
</script>

<template>
  <div class="dashboard-grid">
    <ChartBreakdown
      style="grid-area: breakdown"
      class="breakdown"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-rows: 600px;
  grid-template-areas: "breakdown";

  @media only screen and (max-width: 1280px) {
    grid-auto-flow: row;
  }
}
</style>
