<template>
  <div class="crvusd">
    <TableMarkets
      style="grid-column: 1 / -1"
      @selected="onMarketSelect"
    ></TableMarkets>

    <div class="col">
      <TablePegkeepers></TablePegkeepers>
      <ChartPoolPrices></ChartPoolPrices>
    </div>

    <div class="col">
      <ChartCrvUsdSupply></ChartCrvUsdSupply>
      <ChartCrvUsdPriceHistogram class="price"></ChartCrvUsdPriceHistogram>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TableMarkets,
  TablePegkeepers,
} from "@CM/Pages/Platform/CrvUsd/Tables";
import {
  ChartPoolPrices,
  ChartCrvUsdSupply,
  ChartCrvUsdPriceHistogram,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import type { Market } from "@CM/Services/CrvUsd";

const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());

onMounted(() => {
  showCrumbs.value = true;
  crumbs.value = [
    {
      id: "crvusd",
      label: "crvUSD",
      pathName: "crvusd",
    },
    {
      id: "market",
      label: "Select market for details",
      hint: true,
    },
  ];
});

// Market selection
const router = useRouter();

const onMarketSelect = async (newMarket: Market) => {
  await router.push({
    name: "crvusdmarket",
    params: {
      tab: "",
      marketAddr: newMarket.address,
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("crvusd");

.crvusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 5fr 4fr;

  > .col {
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
      display: flex;
      flex-direction: column;
    }

    div {
      flex-grow: 1;
    }
  }
}
</style>
