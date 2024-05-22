<template>
  <div class="kpis">
    <KPI
      label="CRV Price"
      :has-value="!!price"
    >
      <AsyncValue
        :value="price"
        :precision="3"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="crvUSD Borrowed"
      :has-value="!!borrowed"
    >
      <AsyncValue
        :value="borrowed"
        :precision="2"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Total Value Locked"
      :has-value="!!tvl"
    >
      <AsyncValue
        :value="tvl"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="7-day Volume"
      :has-value="!!volume"
    >
      <AsyncValue
        :value="volume"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { DefiLlamaService } from "@/Services";
import { useQueryChainInfo } from "@CM/Services/Chains/Queries";
import { useQueryMarkets } from "@CM/Services/CrvUsd/Queries";

const llamaService = new DefiLlamaService(getHost());

// Borrowed
const { data: markets } = useQueryMarkets();
const borrowed = computed(
  () => markets.value?.reduce((acc, x) => acc + x.borrowed, 0) ?? 0
);

// ChainInfo
const { data: chainInfo } = useQueryChainInfo(ref("ethereum"));
const tvl = computed(() => chainInfo?.value?.total.tvl ?? 0);
const volume = computed(() => chainInfo?.value?.total.tradingVolume24h ?? 0);

// CRV Price
const { data: price } = useQuery({
  queryKey: ["crv-price"],
  queryFn: () =>
    llamaService
      .getPrice("0xd533a949740bb3306d119cc777fa900ba034cd52")
      .then((x) => x.price),
  initialData: 0,
  initialDataUpdatedAt: 0,
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.kpis {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
}
</style>
