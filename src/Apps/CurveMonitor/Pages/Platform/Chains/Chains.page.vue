<template>
  <div class="chains">
    <Teleport to="#toolbar">
      <div class="toolbar">
        <ActivityTypeSelect
          style="grid-area: type"
          @select="onTypeSelect"
        ></ActivityTypeSelect>

        <SelectChain
          style="grid-area: chain"
          class="chain-select"
          :chain
          :chains
          :all="true"
          @select-chain="chain = $event"
        ></SelectChain>
      </div>
    </Teleport>

    <div class="activity">
      <KPI
        style="grid-area: kpi1"
        :label="t('txs-today')"
        :has-value="!!loadingTxs"
      >
        <AsyncValue
          type="dollar"
          :value="txsToday"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </KPI>

      <KPI
        style="grid-area: kpi2"
        :label="t('txs-avg')"
        :has-value="!!loadingTxs"
      >
        <AsyncValue
          type="dollar"
          :value="txsAvg"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </KPI>

      <KPI
        style="grid-area: kpi3"
        :label="t('users-today')"
        :has-value="!!loadingUsers"
      >
        <AsyncValue
          type="dollar"
          :value="usersToday"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </KPI>

      <KPI
        style="grid-area: kpi4"
        :label="t('users-avg')"
        :has-value="!!loadingUsers"
      >
        <AsyncValue
          type="dollar"
          :value="usersAvg"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </KPI>

      <ChartTxs
        style="grid-area: txs"
        :txs
        :loading="loadingTxs"
      ></ChartTxs>

      <ChartUsers
        style="grid-area: users"
        :users
        :loading="loadingUsers"
      ></ChartUsers>

      <ChartRankingChains
        style="grid-area: top-chains"
        :type
        :txs="rankChainsTxs"
        :users="rankChainsUsers"
        :loading="loadingTxs || loadingUsers"
      ></ChartRankingChains>

      <ChartRankingTypes
        style="grid-area: top-types"
        :chain
        :txs="rankTypesTxs"
        :users="rankTypesUsers"
        :loading="loadingTxs || loadingUsers"
      ></ChartRankingTypes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chain as chain_, last } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import SelectChain from "@CM/Components/SelectChain.vue";
import type { Activity, ActivityType } from "@CM/Services/Chains";
import { useQueryTxs, useQueryUsers } from "@CM/Services/Chains/Queries";
import {
  ChartTxs,
  ChartUsers,
  ChartRankingChains,
  ChartRankingTypes,
} from "@CM/Pages/Platform/Chains/Charts";
import { ActivityTypeSelect } from "@CM/Pages/Platform/Chains/Components";

const { t } = useI18n();

// Hooks
const { show: showCrumbs } = storeToRefs(useBreadcrumbStore());
onMounted(() => {
  showCrumbs.value = false;
});

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
  const allChains = chain_(txsRaw.value.map((x) => x.chain))
    .concat(usersRaw.value.map((x) => x.chain))
    .concat(
      chain.value !== undefined && chain.value !== "all" ? [chain.value] : []
    ) // Add chain selected from router.
    .uniq()
    .orderBy((x) => x)
    .value();

  const topChains: Chain[] = ["ethereum"];
  const orderedChains = chain_(allChains)
    .difference(topChains)
    .orderBy((x) => x)
    .value();

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
  return chain_(activities)
    .filter((x) => (chain === "all" ? true : x.chain === chain))
    .filter((x) => (type === "all" ? true : x.type === type))
    .groupBy((x) => x.timestamp)
    .mapValues((xs, timestamp) => {
      const sum = xs.reduce((acc, x) => acc + selector(x), 0);

      return {
        timestamp: Number(timestamp),
        count: sum,
      };
    })
    .values()
    .value();
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

  const total = lastSevenDaysActivities.reduce((acc, x) => acc + x.count, 0);

  return daysBetween > 0 ? Math.round(total / daysBetween) : 0;
}

const txsToday = computed(() => last(txs.value)?.count ?? 0);
const txsAvg = computed(() => calculateAverage(txs.value));

const usersToday = computed(() => last(users.value)?.count ?? 0);
const usersAvg = computed(() => calculateAverage(users.value));

// Ranking
function filterAndSelect<T extends Activity>(
  activities: T[],
  chain: Chain | "all",
  type: ActivityType | "all",
  selector: (activity: T) => number
) {
  return chain_(activities)
    .filter((x) => (chain === "all" ? true : x.chain === chain))
    .filter((x) => (type === "all" ? true : x.type === type))
    .map((x) => ({ chain: x.chain, type: x.type, value: selector(x) }))
    .value();
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("chains");

.chains {
  max-width: calc(1920px - 18.125rem);

  .activity {
    @include dashboard-grid;

    grid-template-columns: repeat(4, 1fr);

    grid-template-areas:
      "kpi1 kpi2 kpi3 kpi4"
      "txs txs users users"
      "top-chains top-chains top-types top-types";
  }
}

.toolbar {
  height: 100%;
  display: grid;
  gap: var(--dashboard-gap);
  grid-template-columns: 14rem 14rem;
  grid-template-areas: "type chain";

  @media only screen and (max-width: 1280px) {
    display: flex;

    > * {
      flex-grow: 1;
    }
  }
}
</style>

<style lang="scss"></style>

<i18n lang="yaml" locale="en">
txs-today: Transactions Today
txs-avg: Avg Transactions / 7 Days

users-today: Users Today
users-avg: Avg Users / 7 Days
</i18n>
