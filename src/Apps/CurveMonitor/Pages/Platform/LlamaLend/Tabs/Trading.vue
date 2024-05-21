<template>
  <div class="trading">
    <KPI
      style="grid-area: oracle"
      :label="t('oracle')"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.price_oracle"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      style="grid-area: amm"
      :label="t('amm')"
      :has-value="!!market"
    >
      <AsyncValue
        :value="market?.amm_price"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <ChartOHLC
      style="grid-area: ohlc"
      endpoint="lending"
      :llamma
      :chain
    ></ChartOHLC>

    <TableTrades
      style="grid-area: trades"
      endpoint="lending"
      :llamma
      :chain
    ></TableTrades>

    <TableEvents
      style="grid-area: events"
      endpoint="lending"
      :llamma
      :chain
    ></TableEvents>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/LlamaLend";
import { ChartOHLC, TableTrades, TableEvents } from "@CM/Components/Llamma";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

const llamma = computed(() => market?.llamma);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trading {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;

  grid-template-areas:
    "oracle amm"
    "ohlc ohlc"
    "trades events";
}
</style>

<i18n lang="yaml" locale="en">
oracle: Oracle price
amm: AMM price
</i18n>
