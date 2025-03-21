<script setup lang="ts">
import { useQueryChainInfo } from "@CM/queries/chains";
import { useQueryPools } from "@CM/queries/pools";
import type { Chain } from "@curvefi/prices-api";
import type { Pool } from "@curvefi/prices-api/pools";
import TablePools from "./Tables/TablePools.vue";

const chains: Chain[] = ["ethereum", "arbitrum"];
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

// Data
const { isFetching: loadingChainInfo, data: chainInfo } =
  useQueryChainInfo(chain);

const { isFetching: loadingPools, data: poolsRaw } = useQueryPools(chain);

const pools = computed((): Pool[] =>
  (poolsRaw.value?.pools ?? []).filter((pool) => {
    const terms = search.value.toLocaleLowerCase().split(" ");

    const includesTerm = (x: string): boolean =>
      terms.some((term) => x.toLocaleLowerCase().includes(term));

    return includesTerm(pool.name) || includesTerm(pool.address);
  })
);

// Crumbs
const { crumbs } = storeToRefs(useBreadcrumbStore());
crumbs.value = [
  {
    id: "pools",
    label: "Pools",
    pathName: "pools",
  },
  {
    id: "pool",
    label: "Select pool for details",
    hint: true,
  },
];

// Market selection
const router = useRouter();

const onPoolSelect = async (newPool: Pool) => {
  await router.push({
    name: "poolspool",
    params: {
      tab: "",
      chain: chain.value,
      poolAddr: newPool.address,
    },
  });
};
</script>

<template>
  <div class="dashboard">
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

    <KPI
      style="grid-area: kpi1"
      label="TVL"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.tvl ?? 0"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Volume (24h)"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.tradingVolume24h ?? 0"
      />
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Fees Trading (24h)"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.tradingFee24h ?? 0"
      />
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="Fees Liquidity (24h)"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.liquidityFee24h ?? 0"
      />
    </KPI>

    <TablePools
      style="grid-area: pools"
      :chain
      :pools
      :loading="loadingPools"
      @select="onPoolSelect"
    />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "toolbar toolbar toolbar toolbar"
    "kpi1 kpi2 kpi3 kpi4"
    "pools pools pools pools";
}

.toolbar {
  .input-text {
    min-width: 14rem;
  }

  .select {
    min-width: 14rem;
  }

  @media only screen and (max-width: 1280px) {
    > * {
      flex-basis: 0;
      flex-grow: 1;
    }
  }
}
</style>
