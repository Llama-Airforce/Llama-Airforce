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
      :market
      :chain
    ></ChartOHLC>

    <TableTrades
      style="grid-area: trades"
      :market
      :chain
    ></TableTrades>

    <TableEvents
      style="grid-area: events"
      :market
      :chain
    ></TableEvents>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/LlamaLend";

import ChartOHLC from "@CM/Pages/Platform/LlamaLend/Charts/ChartOHLC.vue";
import TableTrades from "@CM/Pages/Platform/LlamaLend/Tables/TableTrades.vue";
import TableEvents from "@CM/Pages/Platform/LlamaLend/Tables/TableEvents.vue";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
  chain?: Chain;
}

const { market, chain } = defineProps<Props>();
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
