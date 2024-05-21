<template>
  <div class="liquidations">
    <div class="soft-liq-ratio">
      <ChartSoftLiqRatios
        :market
        :chain
      ></ChartSoftLiqRatios>
    </div>

    <ChartLiqHistory
      :market
      :chain
    ></ChartLiqHistory>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/LlamaLend";
import {
  ChartSoftLiqRatios,
  ChartLiqHistory,
} from "@CM/Pages/Platform/LlamaLend/Charts";

// Props
interface Props {
  market?: Market;
  chain?: Chain;
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
