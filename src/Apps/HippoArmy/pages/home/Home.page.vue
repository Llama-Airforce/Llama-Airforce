<script setup lang="ts">
import ChartBalances from "@/Framework/Components/charts/ChartBalances.vue";
import { DEFAULT_MIN_HEIGHT } from "@/Styles/ChartStylesLW";
import { useHistory, usePairsEthereum } from "@HA/queries/protocols";
import { useStableOHLC } from "@HA/queries/stablecoin";
import type { History } from "@HA/services/protocols/schema";
import ChartPrice from "./charts/ChartPrice.vue";
import KPIs from "./components/KPIs.vue";

// Prefetching protocol overview data which we suspect is the most visited page
usePairsEthereum();

const { isFetching: loadingPrice, data: price } = useStableOHLC();
const { isFetching: loadingHistory, data: history } = useHistory({
  chain: "ethereum",
});

type NumericHistoryKey<T extends keyof History> = T extends keyof History
  ? History[T] extends number
    ? T
    : never
  : never;

const createBalances = <T extends keyof History>(
  valueKey: NumericHistoryKey<T>
) =>
  (history.value?.snapshots ?? [])
    // Transform into a data structure ChartBalances accepts
    .map((x) => ({
      symbol: x.name,
      balances: [
        {
          timestamp: x.timestamp,
          balance: x[valueKey],
          tokenPrice: 1,
        },
      ],
    }))
    // Group by protocol
    .groupBy((x) => x.symbol)
    .entries()
    // For each protocol, sum the values of each respective timestamp
    .map(([symbol, items]) => ({
      symbol,
      balances: items
        .flatMap((x) => x.balances)
        .groupBy((x) => x.timestamp.getTime())
        .entries()
        .map(([, values]) => ({
          timestamp: values[0].timestamp,
          balance: values.reduce((sum, v) => sum + v.balance, 0),
          tokenPrice: values[0].tokenPrice,
        })),
    }));

const balancesUnderlying = computed(() => createBalances("totalUnderlying"));
const balancesDebt = computed(() => createBalances("totalDebt"));
</script>

<template>
  <div class="dashboard">
    <div class="description">
      <span class="title">Hippo Army</span>
      <span class="tag">Resupplying your portobello with hippo insights.</span>
    </div>

    <img
      class="hippo"
      src="@/Assets/hippo-ghibli.png"
    />

    <div class="highlights">
      <KPIs />
    </div>

    <div class="dashboard-grid charts">
      <ChartPrice
        style="grid-area: price"
        :price
        :loading="loadingPrice"
      />

      <ChartBalances
        v-if="!loadingHistory"
        style="grid-area: underlying"
        title="TVL"
        :balances="balancesUnderlying"
        :show-dollars="false"
      />
      <Card
        v-else
        loading
        title="TVL"
        :style="`grid-area: underlying; min-height: ${DEFAULT_MIN_HEIGHT}`"
      />

      <ChartBalances
        v-if="!loadingHistory"
        style="grid-area: debt"
        title="Debt"
        :balances="balancesDebt"
        :show-dollars="false"
      />
      <Card
        v-else
        loading
        title="Debt"
        :style="`grid-area: debt; min-height: ${DEFAULT_MIN_HEIGHT}`"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-rows: auto 1fr;
  grid-template-columns: 3fr 1fr;
  grid-template-areas:
    "description hippo"
    "highlights hippo"
    "charts charts";

  gap: calc(3 * var(--dashboard-gap));

  @media only screen and (max-width: 1280px) {
    display: grid;
    margin-inline: calc(0.5 * var(--page-margin));
    gap: calc(2 * var(--dashboard-gap));

    grid-template-areas:
      "description description"
      "highlights highlights"
      "charts charts";

    > .description {
      justify-content: center;
    }
  }

  > .description {
    grid-area: description;

    display: flex;
    flex-direction: column;
    gap: 1ch;

    > .title {
      font-size: 3.5rem;
      font-weight: bold;

      @media only screen and (max-width: 825px) {
        font-size: 2.5rem;
      }
    }

    > .tag {
      font-size: 1.5rem;
      opacity: 0.9;

      @media only screen and (max-width: 825px) {
        max-width: 400px;
      }

      @media only screen and (max-width: 600px) {
        max-width: 300px;
      }
    }
  }

  > .highlights {
    grid-area: highlights;

    align-self: start;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(1.25 * var(--dashboard-gap));

    @media only screen and (max-width: 825px) {
      display: flex;
      flex-direction: column;
    }
  }

  > .hippo {
    grid-area: hippo;
    text-align: center;

    min-width: 200px;
    max-width: 300px;
    max-height: 400px;

    object-fit: cover;
    align-self: center;
    border-radius: 10%;

    animation: float 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;

    filter: hue-rotate(-180deg) saturate(45%);

    @media only screen and (max-width: 1280px) {
      grid-area: description;
      justify-self: end;
      z-index: -1;
      min-width: min-content;
      max-height: 200px;
    }

    @media only screen and (max-width: 825px) {
      opacity: 0.25;
    }

    @media only screen and (max-width: 600px) {
      max-height: 150px;
    }
  }

  > .charts {
    grid-area: charts;

    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      "price price"
      "underlying debt";

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
