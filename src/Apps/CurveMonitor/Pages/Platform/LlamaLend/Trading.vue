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

    <TableTrades
      style="grid-area: table"
      :market
      :chain
    ></TableTrades>
  </div>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/LlamaLend";

import TableTrades from "@CM/Pages/Platform/LlamaLend/Tables/TableTrades.vue";

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
  grid-template-rows: auto 1fr 1fr;

  grid-template-areas:
    "oracle amm"
    "table table";
}
</style>

<i18n lang="yaml" locale="en">
oracle: Oracle price
amm: AMM price
</i18n>
