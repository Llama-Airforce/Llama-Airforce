<script setup lang="ts">
import { type Chain } from "@CM/Models";
import {
  useQueryMarkets,
  useQueryChains,
} from "@CM/Services/LlamaLend/Queries";
import { type Market, type MarketPair } from "@CM/Services/LlamaLend";
import SelectChain from "@CM/Components/SelectChain.vue";
import { TableMarkets } from "@CM/Pages/Platform/LlamaLend/Tables";

const chainParam = useRouteParams<Chain | undefined | "">("chain");
const chain = computed({
  get() {
    return !chainParam.value ? "ethereum" : chainParam.value;
  },
  set(newChain) {
    chainParam.value = newChain;
  },
});

const search = ref("");

const marketPairsFiltered = computed((): MarketPair[] =>
  marketPairs.value.filter(({ long, short }) => {
    const terms = search.value.toLocaleLowerCase().split(" ");

    const includesTerm = (x: string): boolean =>
      terms.some((term) => x.toLocaleLowerCase().includes(term));

    return includesTerm(`${long?.name ?? ""}${short?.name ?? ""}`);
  })
);

const marketPairs = computed((): MarketPair[] => {
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
const { isFetching: loadingMarkets, data: marketsRaw } = useQueryMarkets(chain);
const { data: chains } = useQueryChains();

// Hooks
const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());
onMounted(() => {
  showCrumbs.value = true;
  crumbs.value = [
    {
      id: "llamalend",
      label: "Llama Lend",
      pathName: "llamalend",
      params: () => ({
        chain: chain.value,
      }),
    },
    {
      id: "market",
      label: "Select market for details",
      hint: true,
    },
  ];
});

const router = useRouter();

// Market selection
const onMarketSelect = async (newMarket: Market | undefined) => {
  if (!newMarket) {
    return;
  }

  await router.push({
    name: "llamalendmarket",
    params: {
      tab: "",
      chain: chain.value,
      marketAddr: newMarket.controller,
    },
  });
};

// KPIs
const totalBorrowed = (type: "long" | "short"): number => {
  return marketPairsFiltered.value
    .map((market) => (type === "long" ? market.long : market.short))
    .filter((market) => !!market)
    .reduce((acc, market) => acc + market.total_debt_usd, 0);
};

const totalUtilRate = (type: "long" | "short"): number => {
  const totals = marketPairsFiltered.value
    .map((market) => (type === "long" ? market.long : market.short))
    .filter((market) => !!market)
    .reduce(
      ({ debt, assets }, market) => ({
        debt: debt + market.total_debt_usd,
        assets: assets + market.total_assets_usd,
      }),
      { debt: 0, assets: 0 }
    );

  return totals.assets === 0 ? 0 : (totals.debt / totals.assets) * 100;
};
</script>

<template>
  <div class="dashboard">
    <Teleport to="#toolbar">
      <div class="toolbar">
        <InputText
          v-model="search"
          search
          placeholder="Search for..."
        />

        <SelectChain
          class="chain-select"
          :chain
          :chains
          @select-chain="chain = $event === 'all' ? 'ethereum' : $event"
        />
      </div>
    </Teleport>

    <KPI
      style="grid-area: kpi1"
      label="Open Interest (long)"
      :has-value="!loadingMarkets"
    >
      <AsyncValue
        type="dollar"
        :value="totalBorrowed('long')"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Open Interest (short)"
      :has-value="!loadingMarkets"
    >
      <AsyncValue
        type="dollar"
        :value="totalBorrowed('short')"
      />
    </KPI>

    <KPI
      style="grid-area: kpi3"
      tooltip-type="icon"
      label="Average Utilization Rate (long)"
      tooltip="Aggregate debt divided by aggregate assets"
      :has-value="!loadingMarkets"
    >
      <AsyncValue
        type="percentage"
        :value="totalUtilRate('long')"
      />
    </KPI>

    <KPI
      style="grid-area: kpi4"
      tooltip-type="icon"
      label="Average Utilization Rate (short)"
      tooltip="Aggregate debt divided by aggregate assets"
      :has-value="!loadingMarkets"
    >
      <AsyncValue
        type="percentage"
        :value="totalUtilRate('short')"
      />
    </KPI>

    <TableMarkets
      style="grid-area: markets"
      :pairs="marketPairsFiltered"
      :loading="loadingMarkets"
      :chain
      @selected="onMarketSelect"
    />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "markets markets markets markets";

  [style*="grid-area: markets"] {
    max-height: 800px;
  }
}

.toolbar {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(auto, 25rem) 14rem;
  grid-template-rows: auto;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    grid-template-columns: 1fr 14rem;
  }

  .chain-select {
    grid-column: 2;
  }
}
</style>
