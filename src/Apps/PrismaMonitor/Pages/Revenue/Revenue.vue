<template>
  <div class="revenue">
    <ChartRevenue style="grid-column: 1"></ChartRevenue>
    <ChartBreakdown style="grid-column: 2"></ChartBreakdown>
  </div>
</template>

<script setup lang="ts">
import ChartRevenue from "@PM/Pages/Revenue/Charts/ChartRevenue.vue";
import ChartBreakdown from "@PM/Pages/Revenue/Charts/ChartBreakdown.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("revenue");

.revenue {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 2fr 1fr;
}
</style>
