<script setup lang="ts">
import { type Address } from "@/Framework/Address";
import { useWallet, addressShort } from "@/Wallet";
import WalletConnectButton from "@/Wallet/WalletConnectButton.vue";
import type { Epoch, BribedPersonal } from "@LAF/Pages/Bribes/Models";
import SnapshotService, {
  type Scores,
  type Delegation,
} from "@LAF/Pages/Bribes/Rounds/Services/SnapshotService";
import AuraService from "@LAF/Pages/Bribes/Rounds/Services/AuraService";
import {
  getBribedPersonal,
  getVoteDistribution,
  prioritizeDelegates,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";

const snapshotService = new SnapshotService(useHost());
const auraService = new AuraService();

const { t } = useI18n();

const { epoch } = defineProps<{
  epoch?: Epoch;
}>();

// Refs
const { protocol } = storeToRefs(useBribesStore());
const { isConnected, address } = useWallet();

const columns = computed(() => [
  { id: "percentage" as const, label: "%", sort: true as const },
  { id: "pool" as const, label: t("pool"), sort: true as const },
  {
    id: "vlasset" as const,
    label: `$/${vlAssetSymbol(protocol.value)}`,
    sort: true as const,
    align: "end" as const,
  },
  {
    id: "total" as const,
    label: t("total"),
    sort: true as const,
    align: "end" as const,
  },
]);

const { sorting, onSort } = useSort<typeof columns.value>("total");

const isSupported = computed((): boolean => epoch?.platform !== "hh");

const bribedOrdered = computed(() =>
  bribed.value.orderBy((bribed) => {
    switch (sorting.value.column) {
      case "pool":
        return bribed.pool;
      case "vlasset":
        return bribed.dollarPerVlAsset;
      default:
      case "total":
        return bribed.amountDollars;
    }
  }, sorting.value.order)
);

const bribedAmount = computed((): number => {
  return bribedOrdered.value.reduce((acc, x) => acc + x.amountDollars, 0);
});

const personalDollarPerVlAsset = computed((): number | null => {
  const vlAsset = bribedOrdered.value.reduce(
    (acc, x) => acc + x.amountDollars / x.dollarPerVlAsset,
    0
  );

  return bribedAmount.value / vlAsset;
});

const bribed = computed(() => {
  if (
    !epoch ||
    !proposal.value ||
    !address.value ||
    Object.keys(scores.value).length === 0 ||
    votes.value.length === 0
  ) {
    return [];
  }

  // Find the correct delegate by given priority to the space delegate (eg cvx.eth).
  let delegate: Address;
  if (protocol.value === "aura-bal") delegate = delegations.value[0].delegate;
  else {
    delegate = prioritizeDelegates(
      [delegations.value[0], delegations.value[1]],
      votes.value.map((v) => v.voter)
    )[0]?.delegate;
  }

  // Calculate the voting distribution of a user.
  const distribution = getVoteDistribution(
    proposal.value,
    address.value,
    delegate,
    votes.value,
    scores.value
  );

  // Turn that voting distribution into personal pools bribed for dollars.
  return getBribedPersonal(epoch, distribution);
});

const loading = computed(
  () =>
    loadingProposal.value ||
    loadingDelegations.value ||
    loadingVotes.value ||
    loadingScores.value
);

// Data
const { isFetching: loadingProposal, data: proposal } = useQuery({
  queryKey: [
    "bribes-personal-proposal",
    computed(() => epoch?.proposal),
  ] as const,
  queryFn: ({ queryKey: [, proposal] }) => {
    if (proposal) {
      return snapshotService.getProposal(proposal);
    }

    return null;
  },
});

const { isFetching: loadingDelegations, data: delegations } = useQuery({
  queryKey: [
    "bribes-personal-delegations",
    computed(() => proposal.value?.snapshot),
    address,
  ] as const,
  queryFn: ({ queryKey: [, snapshot, voter] }) => {
    if (!snapshot || !voter) {
      return [];
    }

    const block = parseInt(snapshot, 10);

    if (protocol.value === "aura-bal")
      return auraService.getDelegation(voter, block).then((x) => [x]);
    else {
      return snapshotService.getDelegations(block, {
        delegators: [voter],
        space: "cvx.eth",
      });
    }
  },
  initialData: [] as Delegation[],
  initialDataUpdatedAt: 0,
});

const { isFetching: loadingVotes, data: votes } = useQuery({
  queryKey: [
    "bribes-personal-votes",
    computed(() => epoch?.proposal),
    address,
    computed(() => delegations.value.map((x) => x.delegate)),
  ] as const,
  queryFn: ({ queryKey: [, proposal, voter, delegates] }) => {
    if (!proposal || !voter) {
      return [];
    }

    return snapshotService.getVotes(proposal, [voter, ...delegates]);
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

const { isFetching: loadingScores, data: scores } = useQuery({
  queryKey: [
    "bribes-personal-scores",
    computed(() => proposal.value?.snapshot),
    address,
  ] as const,
  queryFn: ({ queryKey: [, snapshot, voter] }) => {
    if (!snapshot || !voter || !protocol.value) {
      return [];
    }

    const block = parseInt(snapshot, 10);

    return snapshotService.getScores(protocol.value, block, [voter]);
  },
  initialData: {} as Scores,
  initialDataUpdatedAt: 0,
});

// Methods
const pool = (bribed: BribedPersonal): string => bribed.pool;
const amountDollars = (bribed: BribedPersonal): number => bribed.amountDollars;
const dollarPerVlAsset = (bribed: BribedPersonal): number =>
  bribed.dollarPerVlAsset;
const percentage = (bribed: BribedPersonal): number => bribed.percentage;
</script>

<template>
  <Card>
    <template #title>
      <div class="card-title">
        {{ t("title") }}
        <span v-if="bribedAmount"> - </span>
        <AsyncValue
          v-if="bribedAmount"
          :value="bribedAmount"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>

    <template #actions>
      <div
        v-if="personalDollarPerVlAsset"
        class="personalDollarPerVlAsset"
      >
        <AsyncValue
          :value="personalDollarPerVlAsset"
          :precision="4"
          type="dollar"
        />/{{ vlAssetSymbol(protocol) }}
      </div>
    </template>

    <Table
      class="personal-table"
      :rows="bribedOrdered"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <Tooltip>
          <template #trigger>
            <div class="bribe">
              <div>
                <AsyncValue
                  :value="percentage(item)"
                  :precision="0"
                  type="percentage"
                />
              </div>

              <div>
                {{ pool(item) }}
              </div>

              <div class="end">
                <AsyncValue
                  :value="dollarPerVlAsset(item)"
                  :precision="5"
                  type="dollar"
                />
              </div>

              <div class="end">
                <AsyncValue
                  :value="amountDollars(item)"
                  :precision="2"
                  type="dollar"
                />
              </div>
            </div>
          </template>

          <div class="tooltip-hover">
            {{ pool(item) }}
          </div>
        </Tooltip>
      </template>

      <template #no-data>
        <div v-if="loading">{{ t("loading") }} {{ addressShort(address) }}</div>
        <WalletConnectButton
          v-if="!isConnected && isSupported"
        ></WalletConnectButton>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.card-title {
  display: flex;
  gap: 0.5ch;
}

.personalDollarPerVlAsset {
  display: flex;
  color: #a1a1aa;
  font-size: 0.75rem;
  margin-right: 1rem;
}

.personal-table {
  --columns-data: 1fr 3fr 2fr 2fr;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tooltip {
    grid-column: 1 / -1;

    .bribe {
      display: grid;
      grid-template-columns: var(--columns-data);
      grid-column-gap: 1rem;
      align-items: center;

      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Personal Rewards
pool: Pool
total: Total
loading: Loading
</i18n>
