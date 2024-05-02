<template>
  <div class="llamalend">
    <TableMarkets
      style="grid-column: 1 / -1"
      @selected="onMarketSelect"
    ></TableMarkets>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { type Chain } from "@CM/Models/Chain";
import { useBreadcrumbStore } from "@CM/Stores";
import { useLlamaLendStore } from "@CM/Pages/Platform/LlamaLend/Store";
import TableMarkets from "@CM/Pages/Platform/LlamaLend/Tables/TableMarkets.vue";
import type { Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

// Refs
const router = useRouter();

const storeBreadcrumb = useBreadcrumbStore();
const storeLlamaLend = useLlamaLendStore();

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "llamalend",
      label: "Llama Lend",
      pathName: "llamalend",
    },
  ];
});

// Events
const onMarketSelect = async ({
  chain,
  market,
}: {
  chain: Chain;
  market: Market;
}) => {
  storeLlamaLend.market = market;

  await router.push({
    name: "llamalendmarket",
    params: {
      tab: "",
      chain,
      marketAddr: market.controller,
    },
  });
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("llamalend");

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
