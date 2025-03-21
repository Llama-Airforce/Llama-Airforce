<script setup lang="ts">
import type { Market } from "@curvefi/prices-api/crvusd";
import { ChartCrvUsdSupply } from "./Charts";
import { TableMarkets } from "./Tables";

const { crumbs } = storeToRefs(useBreadcrumbStore());
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

<template>
  <div class="dashboard">
    <TableMarkets
      style="grid-area: table"
      @select="onMarketSelect"
    />

    <ChartCrvUsdSupply style="grid-area: chart" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "table"
    "chart";
}
</style>
