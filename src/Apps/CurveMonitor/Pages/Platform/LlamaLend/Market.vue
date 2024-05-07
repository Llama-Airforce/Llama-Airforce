<template>
  <div class="market-overview">
    <Spinner
      class="spinner"
      :class="{ loading }"
    ></Spinner>

    <TabView
      v-if="!loading && market"
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <MarketOverview
            v-if="tabActive === 0"
            :market="market"
            :chain="chain"
          ></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 1"
            :market="market"
            :chain="chain"
          ></Liquidations>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { useLlamaLendStore } from "@CM/Pages/Platform/LlamaLend/Store";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";
import MarketOverview from "@CM/Pages/Platform/LlamaLend/MarketOverview.vue";
import Liquidations from "@CM/Pages/Platform/LlamaLend/Liquidations.vue";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models";

const llamaLendService = new LlamaLendService(getHost());

// Refs
const route = useRoute();
const router = useRouter();

const storeBreadcrumb = useBreadcrumbStore();
const storeLlamaLend = useLlamaLendStore();
const tabActive = ref(0);

const chain = computed(() => route.params.chain as Chain);
const marketAddr = computed(() => route.params.marketAddr as string);
const market = computed(() => storeLlamaLend.market);

// Data
const {
  isFetching: loading,
  data: markets,
  refetch,
} = useQuery({
  queryKey: ["llama-markets", chain] as const,
  queryFn: ({ queryKey: [, chain] }) =>
    llamaLendService
      .getMarkets(chain)
      .then((markets) => markets.sort((a, b) => tvl(b) - tvl(a))),
  enabled: false, // Disable automatic execution
});

// Hooks
onMounted(async () => {
  const tabParam = route.params.tab;
  if (tabParam && typeof tabParam === "string") {
    if (tabParam === "liquidations") {
      tabActive.value = 1;
    }
  }

  if (storeLlamaLend.market?.controller !== marketAddr.value && chain.value) {
    await refetch();

    const market = markets.value?.find(
      (market) => market.controller === marketAddr.value
    );

    if (market) {
      storeLlamaLend.market = market;
    }
  }

  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "llamalend",
      label: "Llama Lend",
      pathName: "llamalend",
    },
    {
      id: "market",
      label: `Market: ${market.value?.name ?? "?"}`,
    },
  ];
});

// Watches
watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({
      name: "llamalendmarket",
      params: { tab: "", marketAddr: marketAddr.value },
    });
  } else if (newTab === 1) {
    await router.push({
      name: "llamalendmarket",
      params: { tab: "liquidations", marketAddr: marketAddr.value },
    });
  }
});

// Methods
const tvl = (x: Market) => x.totalAssets + x.collateralBalance * x.priceOracle;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("market-overview");

.market-overview {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);

    @include loading-spinner();
  }
}
</style>
