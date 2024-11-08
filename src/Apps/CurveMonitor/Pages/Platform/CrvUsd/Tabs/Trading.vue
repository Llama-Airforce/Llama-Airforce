<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import type { Market } from "@CM/Services/CrvUsd";
import { ChartOHLC, TableTrades, TableEvents } from "@CM/Components/Llamma";
import {
  useQueryOHLC,
  useQueryEvents,
  useQueryTrades,
} from "@CM/Services/Llamma/Queries";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

const llamma = computed(() => market?.llamma);

// Data
const { isFetching: loadingOHLC, data: ohlc } = useQueryOHLC(
  ref("crvusd"),
  llamma,
  toRef(() => chain)
);

const pageTrades = ref(1);
const { isFetching: loadingTrades, data: trades } = useQueryTrades(
  ref("crvusd"),
  llamma,
  toRef(() => chain),
  pageTrades
);

const pageEvents = ref(1);
const { isFetching: loadingEvents, data: events } = useQueryEvents(
  ref("crvusd"),
  llamma,
  toRef(() => chain),
  pageEvents
);
</script>

<template>
  <div class="dashboard-grid">
    <ChartOHLC
      style="grid-area: ohlc"
      :ohlc="ohlc ?? []"
      :loading="loadingOHLC"
    />

    <TableTrades
      style="grid-area: trades"
      :trades="trades?.trades ?? []"
      :count="trades?.count ?? 0"
      :chain
      :loading="loadingTrades"
      @page="pageTrades = $event"
    />

    <TableEvents
      style="grid-area: events"
      :events="events?.events ?? []"
      :count="events?.count ?? 0"
      :loading="loadingEvents"
      @page="pageEvents = $event"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "ohlc ohlc"
    "trades events";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
