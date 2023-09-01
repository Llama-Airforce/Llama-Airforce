<template>
  <div class="market">
    <ChartLiquidationSoftLiquidation :market="market"></ChartLiquidationSoftLiquidation>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

import ChartLiquidationSoftLiquidation from "@CM/Pages/Platform/CrvUsd/Charts/ChartLiquidationSoftLiquidation.vue";
export default defineComponent({
  props: {
    market: {
      type: Object,
      required: true
    }
  },
  components: {
    ChartLiquidationSoftLiquidation,
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("market");

.market {
  max-width: calc(1920px - 18.125rem);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

@media only screen and (max-width: 1280px) {
  display: flex;
  flex-direction: column;
}
}
</style>
