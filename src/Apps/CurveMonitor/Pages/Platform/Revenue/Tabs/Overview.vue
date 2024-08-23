<script setup lang="ts">
import ChartBreakdown from "@CM/Pages/Platform/Revenue/Charts/ChartBreakdown.vue";
</script>

<template>
  <div class="overview">
    <ChartBreakdown
      style="grid-area: breakdown"
      class="breakdown"
    ></ChartBreakdown>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.overview {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 600px;
  grid-template-areas: "breakdown";

  @media only screen and (max-width: 1280px) {
    grid-auto-flow: row;
  }
}
</style>
