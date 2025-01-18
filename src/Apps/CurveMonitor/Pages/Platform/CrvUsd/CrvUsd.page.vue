<script setup lang="ts">
import {
  TableMarkets,
  TablePegkeepers,
} from "@CM/Pages/Platform/CrvUsd/Tables";
import {
  ChartKeeperPrices,
  ChartCrvUsdSupply,
} from "@CM/Pages/Platform/CrvUsd/Charts";
import type { Market } from "@CM/Services/crvusd";

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
      style="grid-column: 1 / -1"
      @select="onMarketSelect"
    />

    <div class="col">
      <TablePegkeepers />
    </div>

    <div class="col">
      <ChartCrvUsdSupply />
      <ChartKeeperPrices />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 5fr 4fr;

  > .col {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    .card {
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
  }

  & > * {
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
