<template>
  <div class="liquidations">
    <div class="soft-liq-ratio">
      <ChartSoftLiqRatios
        :market="market"
        :chain="chain"
      ></ChartSoftLiqRatios>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";
import ChartSoftLiqRatios from "@CM/Pages/Platform/LlamaLend/Charts/ChartSoftLiqRatios.vue";

// Props
interface Props {
  market: Market | null;
  chain: Chain | null;
}

const { market, chain } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
