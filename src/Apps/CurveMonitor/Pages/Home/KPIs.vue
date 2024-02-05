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
import { ref, onMounted } from "vue";
import { AsyncValue, KPI } from "@/Framework";
import { DefiLlamaService } from "@/Services";
import { getHost } from "@/Services/Host";
import CurvePricesService from "@CM/Pages/Home/Services/CurvePricesService";
import CrvUsdService from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const llamaService = new DefiLlamaService(getHost());
const crvUsdService = new CrvUsdService(getHost());
const curvePricesService = new CurvePricesService(getHost());

// Refs
const price = ref<number | null>(null);
const borrowed = ref<number | null>(null);
const tvl = ref<number | null>(null);
const volume = ref<number | null>(null);

// Hooks
onMounted(async () => {
  const chain_ = curvePricesService.getChain();

  // CRV Price + MCap
  try {
    borrowed.value = await crvUsdService
      .getMarkets()
      .then((x) => x.markets.reduce((acc, x) => acc + x.borrowed, 0));

    price.value = await llamaService
      .getPrice("0xd533a949740bb3306d119cc777fa900ba034cd52")
      .then((x) => x.price);
  } catch {
    [price.value, borrowed.value] = [0, 0];
  }

  // TVL and Volume
  try {
    const chain = await chain_;

    tvl.value = chain.total.total_tvl;
    volume.value = chain.total.trading_volume_24h;
  } catch {
    tvl.value = 0;
    volume.value = 0;
  }
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
