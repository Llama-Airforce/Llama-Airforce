<script setup lang="ts">
import {
  usePool,
  usePoolTvl,
  usePoolVolume,
} from "@/Apps/HippoArmy/queries/stablecoin";
import ChartBalances from "@/Framework/Components/charts/ChartBalances.vue";
import ChartTvl from "@/Framework/Components/charts/ChartTvl.vue";
import ChartVolume from "@/Framework/Components/charts/ChartVolume.vue";
import { DEFAULT_MIN_HEIGHT } from "@/Styles/ChartStylesLW";
import { useOraclePrices } from "@HA/queries/protocols";
import type { OraclePrice } from "@HA/services/protocols/schema";
import ChartPrice from "../charts/ChartPrice.vue";

type Pool = "scrvusd" | "sfrxusd";

const { pool } = defineProps<{
  pool: Pool;
}>();

const poolAddress = computed(() => {
  switch (pool) {
    case "scrvusd":
      return "0xc522A6606BBA746d7960404F22a3DB936B6F4F50";
    case "sfrxusd":
      return "0xed785Af60bEd688baa8990cD5c4166221599A441";
    default:
      throw new Error(`Unknown pool: ${pool as string}`);
  }
});

const { isFetching: loadingPrices, data: pricesData } = useOraclePrices(
  toRef(() => ({
    chain: "ethereum",
  }))
);

const prices = computed(() => {
  const getPrice =
    pool === "scrvusd"
      ? (x: OraclePrice) => x.crvusd
      : (x: OraclePrice) => x.frxusd;

  return (pricesData.value?.prices ?? []).map((x) => ({
    timestamp: x.timestamp,
    price: getPrice(x),
  }));
});

const { isFetching: loadingVolume, data: volumeRaw } = usePoolVolume(
  toRef(() => "ethereum"),
  poolAddress
);

const { isFetching: loadingTvl, data: tvlRaw } = usePoolTvl(
  toRef(() => "ethereum"),
  poolAddress
);

const { isFetching: loadingPool, data: poolData } = usePool(
  toRef(() => "ethereum"),
  poolAddress.value
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
  if (!poolData.value || tvlRaw.value.length === 0) {
    return [];
  }

  return poolData.value.coins.map((coin) => ({
    symbol: coin.symbol,
    balances: tvlRaw.value.map((tvl) => ({
      timestamp: tvl.timestamp,
      balance: tvl.balances[coin.poolIndex],
      tokenPrice: tvl.tokenPrices[coin.poolIndex],
    })),
  }));
});

const loadingBalances = computed(() => loadingPool.value || loadingTvl.value);
</script>

<template>
  <div
    class="title"
    :style="`grid-area: title-${pool}`"
  >
    Pool: {{ pool }}
  </div>

  <ChartPrice
    :style="`grid-area: price-${pool}`"
    :prices
    :loading="loadingPrices"
    :min-move="0.001"
  />

  <ChartVolume
    :style="`grid-area: volume-${pool}`"
    :volume
    :loading="loadingVolume"
  />

  <ChartTvl
    :style="`grid-area: tvl-${pool}`"
    :tvl
    :loading="loadingTvl"
  />

  <ChartBalances
    v-if="!loadingBalances"
    :style="`grid-area: balances-${pool}`"
    :balances
    :loading="loadingBalances"
  />
  <Card
    v-else
    loading
    title="Balances"
    :style="`grid-area: balances-${pool}; min-height: ${DEFAULT_MIN_HEIGHT}`"
  />
</template>

<style scoped>
.title {
  font-size: 1.5rem;
  margin-bottom: -1rem;
  font-weight: 500;
}
</style>
