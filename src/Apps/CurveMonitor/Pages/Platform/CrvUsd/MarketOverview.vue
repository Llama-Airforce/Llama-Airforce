<template>
  <div class="market">
    <ChartMarketRates :market="market"></ChartMarketRates>
    <ChartMarketAvailableCap :market="market"></ChartMarketAvailableCap>
    <ChartMarketLoans :market="market"></ChartMarketLoans>
    <ChartMarketVolume :market="market"></ChartMarketVolume>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { type Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

import ChartMarketVolume from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketVolume.vue";
import ChartMarketLoans from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketRates.vue";
import ChartMarketAvailableCap from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketAvailableCap.vue";
export default defineComponent({
  components: {
    ChartMarketVolume,
    ChartMarketRates,
    ChartMarketLoans,
    ChartMarketAvailableCap,
  },
  props: {
    market: {
      type: Object as () => Market | null,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.market {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
