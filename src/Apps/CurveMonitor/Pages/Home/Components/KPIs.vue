<script setup lang="ts">
import { DefiLlamaService } from "@/Services";
import { useQueryChainInfo } from "@CM/Services/Chains/Queries";
import { useQueryMarkets } from "@CM/Services/CrvUsd/Queries";

const llamaService = new DefiLlamaService();

// Borrowed
const { data: markets } = useQueryMarkets();
const borrowed = computed(() =>
  markets.value.reduce((acc, x) => acc + x.borrowed, 0)
);

// ChainInfo
const { data: chainInfo } = useQueryChainInfo(ref("ethereum"));
const tvl = computed(() => chainInfo.value?.total.tvl ?? 0);
const volume = computed(() => chainInfo.value?.total.tradingVolume24h ?? 0);

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

<template>
  <div class="kpis">
    <KPI
      class="border-special"
      label="CRV Price"
      :has-value="!!price"
    >
      <AsyncValue
        type="dollar"
        :value="price"
        :precision="3"
      />
    </KPI>

    <KPI
      class="border-special"
      label="crvUSD Borrowed"
      :has-value="!!borrowed"
    >
      <AsyncValue
        type="dollar"
        :value="borrowed"
        :precision="2"
      />
    </KPI>

    <KPI
      class="border-special"
      label="Total Value Locked"
      :has-value="!!tvl"
    >
      <AsyncValue
        type="dollar"
        :value="tvl"
        :precision="1"
      />
    </KPI>

    <KPI
      class="border-special"
      label="24h Volume"
      :has-value="!!volume"
    >
      <AsyncValue
        type="dollar"
        :value="volume"
        :precision="1"
      />
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: calc(1.25 * var(--dashboard-gap));

  &:deep(> .kpi) {
    .label {
      font-size: 0.9rem;
    }
  }

  .kpi {
    box-shadow: none;

    --border-special-time: 10s;
  }
}
</style>
