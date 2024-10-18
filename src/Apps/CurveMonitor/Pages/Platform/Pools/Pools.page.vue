<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Pool } from "@CM/Services/Pools";
import { useQueryChainInfo } from "@CM/Services/Chains/Queries";
import { useQueryPools } from "@CM/Services/Pools/Queries";
import SelectChain from "@CM/Components/SelectChain.vue";
import { TablePools } from "@CM/Pages/Platform/Pools/Tables";

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

// Hooks
const { show: showCrumbs, crumbs } = storeToRefs(useBreadcrumbStore());
onMounted(() => {
  showCrumbs.value = true;
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
});

const router = useRouter();

// Market selection
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
    <Teleport to="#toolbar">
      <div class="toolbar">
        <InputText
          v-model="search"
          search
          class="search"
          placeholder="Search for..."
        >
        </InputText>

        <SelectChain
          class="chain-select"
          :chain
          :chains
          @select-chain="chain = $event === 'all' ? 'ethereum' : $event"
        ></SelectChain>
      </div>
    </Teleport>

    <KPI
      style="grid-area: kpi1"
      label="TVL"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.tvl ?? 0"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Volume (24h)"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.tradingVolume24h ?? 0"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Fees Trading (24h)"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.tradingFee24h ?? 0"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="Fees Liquidity (24h)"
      :has-value="!loadingChainInfo"
    >
      <AsyncValue
        type="dollar"
        :value="chainInfo?.total.liquidityFee24h ?? 0"
      ></AsyncValue>
    </KPI>

    <TablePools
      style="grid-area: pools"
      :chain
      :pools
      :loading="loadingPools"
      @selected="onPoolSelect"
    ></TablePools>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "pools pools pools pools";
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

  .search {
    grid-column: 1;
    font-size: 0.875rem;
  }

  .chain-select {
    grid-column: 2;
  }
}
</style>
