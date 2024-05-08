<template>
  <div class="llamalend">
    <div
      class="toolbar"
      style="grid-column: 1 / -1"
    >
      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>

      <SelectChain
        class="chain-select"
        :chain="chain"
        :chains="chains"
        @select-chain="chain = $event === 'all' ? 'ethereum' : $event"
      ></SelectChain>
    </div>

    <TableMarkets
      style="grid-column: 1"
      :markets="markets.map(({ long }) => long)"
      :loading="loadingMarkets"
      :title="t('title-long')"
      @selected="onMarketSelect"
    ></TableMarkets>

    <TableMarkets
      style="grid-column: 2"
      :markets="markets.map(({ short }) => short)"
      :loading="loadingMarkets"
      :title="t('title-short')"
      @selected="onMarketSelect"
    ></TableMarkets>
  </div>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { useLlamaLendStore } from "@CM/Pages/Platform/LlamaLend/Store";
import SelectChain from "@CM/Components/SelectChain.vue";
import LlamaLendService from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendService";
import TableMarkets from "@CM/Pages/Platform/LlamaLend/Tables/TableMarkets.vue";
import type { Market } from "@CM/Pages/Platform/LlamaLend/Models";

type MarketPair = { long?: Market; short?: Market };

const { t } = useI18n();

const llamaLendService = new LlamaLendService(getHost());

// Refs
const router = useRouter();

const storeBreadcrumb = useBreadcrumbStore();
const storeLlamaLend = useLlamaLendStore();

const chain = ref<Chain>("ethereum");
const search = ref("");

const markets = computed((): MarketPair[] =>
  chain_(marketsDivided.value)
    .filter(({ long, short }) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(`${long?.name ?? ""}${short?.name ?? ""}`);
    })
    .value()
);

const marketsDivided = computed((): MarketPair[] => {
  const stables = ["crvusd"];

  const markets = (marketsRaw.value ?? [])
    .map((market) => ({
      market,
      isLong: stables.includes(
        market.borrowed_token.symbol.toLocaleLowerCase()
      ),
      isShort: stables.includes(
        market.collateral_token.symbol.toLocaleLowerCase()
      ),
    }))
    // For now we only care about markets with a specific stable link.
    .filter(({ isLong, isShort }) => isLong || isShort);

  const pairs: MarketPair[] = [];
  const visited = new Set();

  for (const { market, isLong, isShort } of markets) {
    if (visited.has(market.controller)) continue;
    visited.add(market.controller);

    const counterpart = markets.find(
      (m) =>
        m.market.borrowed_token.address === market.collateral_token.address &&
        m.market.collateral_token.address === market.borrowed_token.address
    );

    if (counterpart) {
      visited.add(counterpart.market.controller);
    }

    pairs.push({
      long: isLong ? market : counterpart?.market,
      short: isShort ? market : counterpart?.market,
    });
  }

  return pairs;
});

// Data
const { isFetching: loadingMarkets, data: marketsRaw } = useQuery({
  queryKey: ["llama-markets", chain] as const,
  queryFn: ({ queryKey: [, chain] }) =>
    llamaLendService
      .getMarkets(chain)
      .then((markets) => markets.sort((a, b) => tvl(b) - tvl(a))),
});

const { data: chains } = useQuery({
  queryKey: ["llama-markets-chains"] as const,
  queryFn: () => llamaLendService.getChains(),
  initialData: ["ethereum"] as Chain[],
  initialDataUpdatedAt: 0,
});

// Hooks
onMounted(() => {
  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "llamalend",
      label: "Llama Lend",
      pathName: "llamalend",
    },
    {
      id: "market",
      label: "Select market for details",
      hint: true,
    },
  ];
});

// Events
const onMarketSelect = async (market: Market) => {
  storeLlamaLend.market = market;

  await router.push({
    name: "llamalendmarket",
    params: {
      tab: "",
      chain: chain.value,
      marketAddr: market.controller,
    },
  });
};

// Methods
const tvl = (x: Market) => x.total_assets_usd + x.total_debt_usd;
/* const decimals = (x: number): number => (x >= 1_000_000 ? 2 : 0); */
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("llamalend");

.llamalend {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;

  .toolbar {
    display: grid;
    grid-template-columns: 1fr minmax(auto, 25rem) 14rem;
    grid-template-rows: auto;
    gap: 1rem;

    .search {
      grid-column: 2;
      font-size: 0.875rem;
    }

    .chain-select {
      grid-column: 3;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title-long: Markets - Long
title-short: Markets - Short

search-placeholder: Search for...
</i18n>
