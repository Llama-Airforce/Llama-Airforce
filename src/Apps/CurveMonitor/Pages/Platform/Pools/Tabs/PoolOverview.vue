<template>
  <div class="pool-overview">
    <KPI
      style="grid-area: kpi1"
      :label="t('tokens')"
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
      :label="t('tvl')"
      :has-value="!!pool"
    >
      <AsyncValue
        :value="pool?.tvlUsd ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi3"
      :label="t('volume')"
      :has-value="!!pool"
    >
      <AsyncValue
        :value="pool?.tradingVolume24h ?? 0"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: kpi4"
      :label="t('fees')"
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
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Pool } from "@CM/Services/Pools";
import { useQueryVolume, useQueryTvl } from "@CM/Services/Pools/Queries";
import { useQueryOHLC } from "@CM/Services/OHLC/Queries";
import {
  ChartPrice,
  ChartVolume,
  ChartTvl,
} from "@CM/Pages/Platform/Pools/Charts";

const { t } = useI18n();

// Props
interface Props {
  pool: Pool | undefined;
  chain: Chain | undefined;
}

const { pool, chain } = defineProps<Props>();

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
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.pool-overview {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: repeat(4, 1fr);

  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "price price price price"
    "volume volume tvl tvl";

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

<i18n lang="yaml" locale="en">
tokens: Tokens
tvl: TVL
volume: Volume (24h)
fees: Fees (24h)
</i18n>
