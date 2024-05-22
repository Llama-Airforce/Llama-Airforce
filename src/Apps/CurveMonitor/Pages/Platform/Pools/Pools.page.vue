<template>
  <div class="pools">
    <Teleport to="#toolbar">
      <div class="toolbar">
        <InputText
          v-model="search"
          class="search"
          :search="true"
          :placeholder="t('search-placeholder')"
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
      :label="t('tvl')"
      :has-value="!loading"
    >
      <AsyncValue
        :value="chainInfo?.total.tvl ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      :label="t('volume')"
      :has-value="!loading"
    >
      <AsyncValue
        :value="chainInfo?.total.tradingVolume24h ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      :label="t('fee-trading')"
      :has-value="!loading"
    >
      <AsyncValue
        :value="chainInfo?.total.tradingFee24h ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi4"
      :label="t('fee-liquidity')"
      :has-value="!loading"
    >
      <AsyncValue
        :value="chainInfo?.total.liquidityFee24h ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <TablePools
      style="grid-area: pools"
      :chain
      @selected="onPoolSelect"
    ></TablePools>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { useQueryChainInfo } from "@CM/Services/Chains/Queries";
import { type Pool } from "@CM/Services/Pools";
import SelectChain from "@CM/Components/SelectChain.vue";
import { TablePools } from "@CM/Pages/Platform/Pools/Tables";

const { t } = useI18n();

const chains: Chain[] = ["ethereum"];
const chainParam = useRouteParams<Chain | "">("chain");
const chain = computed({
  get() {
    return chainParam.value === "" ? "ethereum" : chainParam.value;
  },
  set(newChain) {
    chainParam.value = newChain;
  },
});

const search = ref("");

// Data
const { isFetching: loading, data: chainInfo } = useQueryChainInfo(chain);

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pools");

.pools {
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

<style lang="scss"></style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for...

tvl: TVL
volume: Volume (24h)
fee-trading: Fees Trading (24h)
fee-liquidity: Fees Liquidity (24h)
</i18n>
