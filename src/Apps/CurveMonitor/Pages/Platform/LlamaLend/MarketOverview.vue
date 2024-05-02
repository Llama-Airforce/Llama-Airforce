<template>
  <div class="market">
    <ChartMarketRates
      :market="market"
      :chain="chain"
    ></ChartMarketRates>

    <ChartMarketLoans
      :market="market"
      :chain="chain"
    ></ChartMarketLoans>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

import ChartMarketLoans from "@CM/Pages/Platform/LlamaLend/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/LlamaLend/Charts/ChartMarketRates.vue";

// Props
interface Props {
  market: Market | null;
  chain: Chain | null;
}

const { market, chain } = defineProps<Props>();
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
