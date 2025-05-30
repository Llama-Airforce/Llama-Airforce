<script setup lang="ts">
import { useQueryTxs, useQueryUsers } from "@CM/queries/chains";
import type { Chain } from "@curvefi/prices-api";
import type { Activity, ActivityType } from "@curvefi/prices-api/chains";
import {
  ChartTxs,
  ChartUsers,
  ChartRankingChains,
  ChartRankingTypes,
} from "./Charts";
import { ActivityTypeSelect } from "./Components";

// Chain selection
const chainParam = useRouteParams<Chain | "all" | undefined | "">("chain");
const chain = computed({
  get() {
    return !chainParam.value ? "all" : chainParam.value;
  },
  set(newChain) {
    chainParam.value = newChain;
  },
});

/*
 * Chain selection depends on what the API gives back, defaults to 'all'.
 * Order alphabetically but put all and ethereum on top.
 */
const chains = computed((): (Chain | "all")[] => {
  const allChains = txsRaw.value
    .map((x) => x.chain)
    .concat(usersRaw.value.map((x) => x.chain))
    .concat(chain.value !== "all" ? [chain.value] : []) // Add chain selected from router.
    .uniq()
    .orderBy((x) => x, "asc");

  const topChains: Chain[] = ["ethereum"];
  const orderedChains = allChains
    .difference(topChains)
    .orderBy((x) => x, "asc");

  return ["all", ...topChains, ...orderedChains];
});

// Activity Type
const typeParam = useRouteParams<ActivityType | "all" | undefined | "">("type");
const type = computed({
  get() {
    return !typeParam.value ? "all" : typeParam.value;
  },
  set(newType) {
    typeParam.value = newType;
  },
});
const onTypeSelect = (newType: ActivityType | "all"): void => {
  type.value = newType;
};

// Data
const { isFetching: loadingTxs, data: txsRaw } = useQueryTxs();
const { isFetching: loadingUsers, data: usersRaw } = useQueryUsers();

function filterAndSum<T extends Activity>(
  activities: T[],
  chain: Chain | "all",
  type: ActivityType | "all",
  selector: (activity: T) => number
) {
  return activities
    .filter((x) => (chain === "all" ? true : x.chain === chain))
    .filter((x) => (type === "all" ? true : x.type === type))
    .groupBy((x) => x.timestamp.getTime())
    .entries()
    .map(([timestamp, xs]) => ({
      timestamp: Number(timestamp) / 1000,
      count: xs.sumBy(selector),
    }));
}

const txs = computed(() =>
  filterAndSum(txsRaw.value, chain.value, type.value, (x) => x.transactions)
);
const users = computed(() =>
  filterAndSum(usersRaw.value, chain.value, type.value, (x) => x.users)
);

// KPIs
function calculateAverage(activities: { timestamp: number; count: number }[]) {
  const daysBetween = 7; // Always consider 7 days
  const now = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const sevenDaysAgo = now - daysBetween * 24 * 60 * 60; // Calculate timestamp 7 days ago

  // Filter activities within the last 7 days
  const lastSevenDaysActivities = activities.filter(
    (activity) => activity.timestamp >= sevenDaysAgo
  );

  const total = lastSevenDaysActivities.sumBy((x) => x.count);

  return Math.round(total / daysBetween);
}

const txsToday = computed(() => txs.value.at(-1)?.count ?? 0);
const txsAvg = computed(() => calculateAverage(txs.value));

const usersToday = computed(() => users.value.at(-1)?.count ?? 0);
const usersAvg = computed(() => calculateAverage(users.value));

// Ranking
function filterAndSelect<T extends Activity>(
  activities: T[],
  chain: Chain | "all",
  type: ActivityType | "all",
  selector: (activity: T) => number
) {
  return activities
    .filter((x) => (chain === "all" ? true : x.chain === chain))
    .filter((x) => (type === "all" ? true : x.type === type))
    .map((x) => ({ chain: x.chain, type: x.type, value: selector(x) }));
}

const rankChainsTxs = computed(() =>
  filterAndSelect(txsRaw.value, "all", type.value, (x) => x.transactions)
);

const rankChainsUsers = computed(() =>
  filterAndSelect(usersRaw.value, "all", type.value, (x) => x.users)
);

const rankTypesTxs = computed(() =>
  filterAndSelect(txsRaw.value, chain.value, "all", (x) => x.transactions)
);

const rankTypesUsers = computed(() =>
  filterAndSelect(usersRaw.value, chain.value, "all", (x) => x.users)
);
</script>

<template>
  <div class="dashboard">
    <div class="toolbar">
      <ActivityTypeSelect
        style="grid-area: type"
        @select="onTypeSelect"
      />

      <SelectChain
        all
        style="grid-area: chain"
        class="chain-select"
        :chain
        :chains
        @select-chain="chain = $event"
      />
    </div>

    <KPI
      style="grid-area: kpi1"
      label="Transactions Today"
      :has-value="!!loadingTxs"
    >
      <AsyncValue
        show-zero
        type="dollar"
        :value="txsToday"
        :show-symbol="false"
      />
    </KPI>

    <KPI
      style="grid-area: kpi2"
      label="Avg Transactions / 7 Days"
      :has-value="!!loadingTxs"
    >
      <AsyncValue
        show-zero
        type="dollar"
        :value="txsAvg"
        :show-symbol="false"
      />
    </KPI>

    <KPI
      style="grid-area: kpi3"
      label="Avg Users / 7 Days"
      :has-value="!!loadingUsers"
    >
      <AsyncValue
        show-zero
        type="dollar"
        :value="usersToday"
        :show-symbol="false"
      />
    </KPI>

    <KPI
      style="grid-area: kpi4"
      label="Users Today"
      :has-value="!!loadingUsers"
    >
      <AsyncValue
        show-zero
        type="dollar"
        :value="usersAvg"
        :show-symbol="false"
      />
    </KPI>

    <ChartTxs
      style="grid-area: txs"
      :txs
      :loading="loadingTxs"
    />

    <ChartUsers
      style="grid-area: users"
      :users
      :loading="loadingUsers"
    />

    <ChartRankingChains
      style="grid-area: top-chains"
      :type
      :txs="rankChainsTxs"
      :users="rankChainsUsers"
      :loading="loadingTxs || loadingUsers"
    />

    <ChartRankingTypes
      style="grid-area: top-types"
      :chain
      :txs="rankTypesTxs"
      :users="rankTypesUsers"
      :loading="loadingTxs || loadingUsers"
    />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "toolbar toolbar toolbar toolbar"
    "kpi1 kpi2 kpi3 kpi4"
    "txs txs users users"
    "top-chains top-chains top-types top-types";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "toolbar toolbar"
      "kpi1 kpi2"
      "kpi3 kpi4"
      "txs txs"
      "users users"
      "top-chains top-chains"
      "top-types top-types";
  }
}

.toolbar {
  .select {
    min-width: 14rem;
  }

  @media only screen and (max-width: 1280px) {
    > * {
      flex-basis: 0;
      flex-grow: 1;
    }
  }
}
</style>
