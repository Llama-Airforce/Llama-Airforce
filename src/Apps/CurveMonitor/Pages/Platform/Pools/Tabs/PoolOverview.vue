<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Pool } from "@CM/Services/Pools";
import { useQueryVolume, useQueryTvl } from "@CM/Services/Pools/Queries";
import { useQueryOHLC } from "@CM/Services/OHLC/Queries";
import {
  ChartPrice,
  ChartVolume,
  ChartTvl,
  ChartBalances,
} from "@CM/Pages/Platform/Pools/Charts";

const { pool, chain } = defineProps<{
  pool: Pool | undefined;
  chain: Chain | undefined;
}>();

const poolAddr = computed(() => pool?.address);
const coin0 = computed(() => pool?.coins[0].address);
const coin1 = computed(() => pool?.coins[1].address);

// Data
const { isFetching: loadingOHLC, data: ohlc } = useQueryOHLC(
  toRef(() => chain),
  poolAddr,
  coin0,
  coin1
);

const { isFetching: loadingVolume, data: volumeRaw } = useQueryVolume(
  toRef(() => chain),
  poolAddr
);

const { isFetching: loadingTvl, data: tvlRaw } = useQueryTvl(
  toRef(() => chain),
  poolAddr
);

const volume = computed(() =>
  volumeRaw.value.map((x) => ({
    timestamp: x.timestamp,
    volume: x.volume,
  }))
);

const tvl = computed(() =>
  tvlRaw.value.map((x) => ({
    timestamp: x.timestamp,
    tvl: x.tvlUSD,
  }))
);

const balances = computed(() => {
  if (!pool) {
    return [];
  }
  console.log(pool);

  return pool.coins.map((coin) => ({
    symbol: coin.symbol,
    balances: tvlRaw.value.map((tvl) => ({
      timestamp: tvl.timestamp,
      balance: tvl.balances[coin.poolIndex],
    })),
  }));
});
</script>

<template>
  <div class="dashboard-grid">
    <KPI
      style="grid-area: kpi1"
      label="Tokens"
      :has-value="!!pool"
    >
      <div class="tokens">
        <TokenIcon
          v-for="token of pool?.coins ?? []"
          :key="token.address"
          :chain
          :address="token.address"
          :clickable="true"
        ></TokenIcon>
      </div>
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="TVL"
      :has-value="!!pool"
    >
      <AsyncValue
        :value="pool?.tvlUsd ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Volume (24h)"
      :has-value="!!pool"
    >
      <AsyncValue
        :value="pool?.tradingVolume24h ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="Fees (24h)"
      :has-value="!!pool"
    >
      <AsyncValue
        :value="pool?.tradingFee24h ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <ChartPrice
      style="grid-area: price"
      :ohlc
      :loading="loadingOHLC"
    ></ChartPrice>

    <ChartVolume
      style="grid-area: volume"
      :volume
      :loading="loadingVolume"
    ></ChartVolume>

    <ChartTvl
      style="grid-area: tvl"
      :tvl
      :loading="loadingTvl"
    ></ChartTvl>

    <ChartBalances
      style="grid-area: balances"
      :balances
      :loading="loadingTvl"
    ></ChartBalances>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "price price tvl tvl"
    "volume volume balances balances";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "kpi1 kpi2"
      "kpi3 kpi4"
      "price price"
      "volume volume"
      "tvl tvl"
      "balances balances";
  }

  .tokens {
    display: grid;
    gap: 1ch;
    grid-template-columns: repeat(4, 26px);
    justify-content: space-between;
    align-items: center;

    img {
      aspect-ratio: 1;
      max-width: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
  }
}
</style>
