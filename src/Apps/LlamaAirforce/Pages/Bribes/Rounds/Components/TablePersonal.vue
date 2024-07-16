<template>
  <DataTable
    class="datatable-bribe-personal"
    :rows="bribedOrdered"
    :columns="['%', t('pool'), `$/${vlAssetSymbol(protocol)}`, t('total')]"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumns"
    sorting-default-column="total"
    sorting-default-dir="desc"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">
        {{ t("title") }}
        <span v-if="bribedAmount">
          -
          <AsyncValue
            :value="bribedAmount"
            :precision="2"
            type="dollar"
          />
        </span>
      </div>
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

    <template #row="props: { item: BribedPersonal }">
      <Tooltip>
        <template #item>
          <div class="tooltip-personal-columns-data">
            <div>
              <AsyncValue
                :value="percentage(props.item)"
                :precision="0"
                type="percentage"
              />
            </div>
            <div>
              {{ pool(props.item) }}
            </div>
            <div class="number">
              <AsyncValue
                :value="dollarPerVlAsset(props.item)"
                :precision="5"
                type="dollar"
              />
            </div>
            <div class="number">
              <AsyncValue
                :value="amountDollars(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
          </div>
        </template>

        <div class="tooltip-hover">
          {{ pool(props.item) }}
        </div>
      </Tooltip>
    </template>

    <template #no-data>
      <div v-if="loading">{{ t("loading") }} {{ addressShort(address) }}</div>
      <WalletConnectButton
        v-if="!isConnected && isSupported"
      ></WalletConnectButton>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
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

const snapshotService = new SnapshotService();
const auraService = new AuraService();

const { t } = useI18n();

// Props
interface Props {
  epoch?: Epoch;
}

const { epoch } = defineProps<Props>();

// Refs
const { protocol } = storeToRefs(useBribesStore());
const { isConnected, address } = useWallet();

const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["percentage", "pool", "vlasset", "total"],
  "total"
);

const isSupported = computed((): boolean => epoch?.platform !== "hh");

const bribedOrdered = computed((): BribedPersonal[] => {
  return orderBy(
    bribed.value,
    (bribed) => {
      switch (sortColumn.value) {
        case "pool":
          return bribed.pool;
        case "vlasset":
          return bribed.dollarPerVlAsset;
        default:
        case "total":
          return bribed.amountDollars;
      }
    },
    sortOrder.value
  );
});

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-personal {
  --columns-header: 1fr auto;
  --columns-data: 1fr 3fr 2fr 2fr;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.header-content) {
    .personalDollarPerVlAsset {
      color: #a1a1aa;
      font-size: 0.75rem;
      margin-right: 1rem;
    }
  }

  :deep(.row-data) {
    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }
  }

  :deep(.tooltip) {
    grid-column: 1 / span 5;
    display: flex;
    height: 100%;
    align-items: center;

    > div {
      display: flex;
      flex-grow: 1;
      height: 100%;
      align-items: center;

      > div {
        display: flex;
        flex-grow: 1;
        height: 100%;
        align-items: center;

        > .tooltip-personal-columns-data {
          flex-grow: 1;
          display: grid;
          grid-template-columns: 1fr 3fr 2fr 2fr;
          align-items: center;

          // Right adjust number columns.
          div:nth-child(3),
          div:nth-child(4) {
            justify-content: end;
          }
        }
      }
    }

    > .popper {
      height: auto;
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
