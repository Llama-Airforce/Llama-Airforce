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
      label="24h Volume"
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

<style lang="scss" scoped>
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

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
    position: relative;
    box-shadow: none;
    flex-grow: 0;

    &::before,
    &::after {
      --padding: 3px;

      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      z-index: -1;
      padding: var(--padding);
      border-radius: calc(var(--border-radius) + var(--padding));

      background-image: conic-gradient(
        from var(--angle),
        var(--c-card-special-1),
        var(--c-card-special-2),
        var(--c-card-special-1)
      );

      animation: 10s spin linear infinite;

      @keyframes spin {
        from {
          --angle: 0deg;
        }

        to {
          --angle: 360deg;
        }
      }
    }

    &::after {
      filter: blur(5px);
      opacity: 0.5;
    }
  }
}
</style>
