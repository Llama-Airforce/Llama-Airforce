<script setup lang="ts">
import Pool from "./components/Pool.vue";
</script>

<template>
  <div class="dashboard">
    <DashboardHeader
      style="grid-area: header"
      title="Stablecoin"
      description="reUSD stablecoin metrics and liquidity pool analytics"
    />

    <Pool pool="scrvusd" />
    <Pool pool="sfrxusd" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas:
    "header header"
    "title-scrvusd title-sfrxusd"
    "price-scrvusd price-sfrxusd"
    "volume-scrvusd volume-sfrxusd"
    "tvl-scrvusd tvl-sfrxusd"
    "balances-scrvusd balances-sfrxusd";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
