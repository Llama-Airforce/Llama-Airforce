<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Market } from "@CM/Services/LlamaLend";
import { ChartOHLC, TableTrades, TableEvents } from "@CM/Components/Llamma";
import {
  useQueryOHLC,
  useQueryEvents,
  useQueryTrades,
} from "@CM/Services/Llamma/Queries";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

const llamma = computed(() => market?.llamma);

// Data
const { isFetching: loadingOHLC, data: ohlc } = useQueryOHLC(
  ref("lending"),
  llamma,
  toRef(() => chain)
);

const pageTrades = ref(1);
const { isFetching: loadingTrades, data: trades } = useQueryTrades(
  ref("lending"),
  llamma,
  toRef(() => chain),
  pageTrades
);

const pageEvents = ref(1);
const { isFetching: loadingEvents, data: events } = useQueryEvents(
  ref("lending"),
  llamma,
  toRef(() => chain),
  pageEvents
);
</script>

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
      :ohlc="ohlc ?? []"
      :loading="loadingOHLC"
    ></ChartOHLC>

    <TableTrades
      style="grid-area: trades"
      :trades="trades?.trades ?? []"
      :count="trades?.count ?? 0"
      :chain
      :loading="loadingTrades"
      @page="pageTrades = $event"
    ></TableTrades>

    <TableEvents
      style="grid-area: events"
      :events="events?.events ?? []"
      :count="events?.count ?? 0"
      :loading="loadingEvents"
      @page="pageEvents = $event"
    ></TableEvents>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trading {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "oracle amm"
    "ohlc ohlc"
    "trades events";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>

<i18n lang="yaml" locale="en">
oracle: Oracle price
amm: AMM price
</i18n>
