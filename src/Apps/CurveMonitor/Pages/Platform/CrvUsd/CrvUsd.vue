<template>
  <div class="crvusd">
    <div class="markets">
      <TableMarkets></TableMarkets>

      <ChartMarketVolume
        market="0x8472a9a7632b173c8cf3a86d3afec50c35548e76"
      ></ChartMarketVolume>

      <div class="row">
        <ChartMarketRates
          style="flex-grow: 1"
          market="0x8472a9a7632b173c8cf3a86d3afec50c35548e76"
        ></ChartMarketRates>

        <ChartMarketLoans
          market="0x8472a9a7632b173c8cf3a86d3afec50c35548e76"
        ></ChartMarketLoans>
      </div>

      <ChartMarketDeciles
        market="0x8472a9a7632b173c8cf3a86d3afec50c35548e76"
      ></ChartMarketDeciles>
    </div>

    <div class="pools">
      <TablePoolStats></TablePoolStats>

      <ChartCrvUsdPriceHistogram class="price"></ChartCrvUsdPriceHistogram>

      <ChartPoolPrices></ChartPoolPrices>
    </div>
  </div>
</template>

<script setup lang="ts">
import TableMarkets from "@CM/Pages/Platform/CrvUsd/Tables/TableMarkets.vue";
import TablePoolStats from "@CM/Pages/Platform/CrvUsd/Tables/TablePoolStats.vue";
import ChartMarketVolume from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketVolume.vue";
import ChartMarketLoans from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketLoans.vue";
import ChartMarketRates from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketRates.vue";
import ChartMarketDeciles from "@CM/Pages/Platform/CrvUsd/Charts/ChartMarketDeciles.vue";
import ChartPoolPrices from "@CM/Pages/Platform/CrvUsd/Charts/ChartPoolPrices.vue";
import ChartCrvUsdPriceHistogram from "@CM/Pages/Platform/CrvUsd/Charts/ChartCrvUsdPriceHistogram.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("crvusd");

.crvusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;

  > .markets {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    div {
      flex-grow: 0;
    }
  }

  > .pools {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    div {
      flex-grow: 0;
    }
  }

  .row {
    display: flex;
    gap: var(--dashboard-gap);

    @media only screen and (max-width: 1280px) {
      flex-direction: column;
    }
  }
}
</style>
