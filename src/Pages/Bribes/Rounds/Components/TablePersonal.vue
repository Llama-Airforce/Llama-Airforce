<template>
  <DataTable
    class="datatable-bribe-personal"
    columns-header="1fr auto"
    columns-data="personal-columns-data"
    :rows="bribedOrdered"
    :columns="['', '%', 'Pool', `$/${vlAssetSymbol(protocol)}`, 'Total']"
    :selected-row="epoch"
    :sorting="true"
    :sorting-columns="['', 'percentage', 'pool', 'vlasset', 'total']"
    :sorting-columns-enabled="['percentage', 'pool', 'vlasset', 'total']"
    sorting-default-column="total"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #header-title>
      <div>
        Personal Rewards
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
      <div class="logo">
        <img
          class="logo-img"
          :src="icon(props.item.pool, false)"
        />
      </div>
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
    </template>

    <template #no-data>
      <div v-if="loading">Loading {{ voterShort }}</div>
      <WalletConnectButton
        v-if="!connected"
        @connected="onConnected"
      ></WalletConnectButton>
    </template>
  </DataTable>
</template>

<script
  setup
  lang="ts"
>
import { watch } from "vue";
import { $ref, $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import DataTable from "@/Framework/DataTable.vue";
import { SortOrder } from "@/Framework/SortOrder";
import WalletConnectButton from "@/Wallet/WalletConnectButton.vue";
import type { BribedPersonal } from "@/Pages/Bribes/Models/Bribed";
import type { Epoch } from "@/Pages/Bribes/Models/Epoch";
import type { Protocol } from "@/Pages/Bribes/Models/Protocol";
import SnapshotService, {
  Delegation,
} from "@/Pages/Bribes/Rounds/Services/SnapshotService";
import AuraService from "@/Pages/Bribes/Rounds/Services/AuraService";
import { useWalletStore } from "@/Wallet/Store";
import {
  getBribedPersonal,
  getVoteDistribution,
  prioritizeDelegates,
} from "@/Pages/Bribes/Util/EpochHelper";
import { addressShort } from "@/Wallet/WalletHelper";
import { vlAssetSymbol } from "@/Pages/Bribes/Util/ProtocolHelper";
import { icon } from "@/Util/PoolHelper";
import { orderBy } from "lodash";
import { useBribesStore } from "@/Pages/Bribes/Store";
import { getHost } from "@/Services/Host";

const snapshotService = new SnapshotService(getHost());
const auraService = new AuraService(getHost());

// Refs
const store = useBribesStore();
const wallet = useWalletStore();

let sortColumn: "pool" | "vlasset" | "total" = $ref("total");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

let bribed: BribedPersonal[] = $ref([]);
let voter = $ref("");
let loading = $ref(false);

const epoch = $computed((): Epoch | null => {
  return store.selectedEpoch;
});

const protocol = $computed((): Protocol | null => {
  return store.selectedProtocol;
});

const bribedOrdered = $computed((): BribedPersonal[] => {
  return orderBy(
    bribed,
    (bribed) => {
      switch (sortColumn) {
        case "pool":
          return bribed.pool;
        case "vlasset":
          return bribed.dollarPerVlAsset;
        default:
        case "total":
          return bribed.amountDollars;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

const voterShort = $computed((): string => {
  return addressShort(voter);
});

const connected = $computed((): boolean => {
  return wallet.connected;
});

const bribedAmount = $computed((): number => {
  return bribedOrdered.reduce((acc, x) => acc + x.amountDollars, 0);
});

const personalDollarPerVlAsset = $computed((): number | null => {
  const vlAsset = bribedOrdered.reduce(
    (acc, x) => acc + x.amountDollars / x.dollarPerVlAsset,
    0
  );

  return bribedAmount / vlAsset;
});

// Events
const onConnected = async (): Promise<void> => {
  if (epoch) {
    await onEpoch(epoch);
  }
};

// Methods
const pool = (bribed: BribedPersonal): string => {
  return bribed.pool;
};

const amountDollars = (bribed: BribedPersonal): number => {
  return bribed.amountDollars;
};

const dollarPerVlAsset = (bribed: BribedPersonal): number => {
  return bribed.dollarPerVlAsset;
};

const percentage = (bribed: BribedPersonal): number => {
  return bribed.percentage;
};

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "pool" | "vlasset" | "total";
  sortOrder = order;
};

const onEpoch = async (newEpoch?: Epoch): Promise<void> => {
  bribed = [];

  if (!wallet.address) return;
  voter = wallet.address;

  if (!newEpoch || !protocol) {
    return;
  }

  loading = true;

  const proposal = await snapshotService.getProposal(newEpoch.proposal);
  const block = parseInt(proposal.snapshot, 10);

  let delegations: Delegation[];

  if (protocol === "aura-bal")
    delegations = [await auraService.getDelegation(voter, block)];
  else {
    delegations = await snapshotService.getDelegations(block, {
      delegators: [voter],
      space: snapshotService.getSpace(protocol),
    });
  }

  const votes = await snapshotService.getVotes(newEpoch.proposal, [
    voter,
    ...delegations.map((d) => d.delegate),
  ]);

  // Find the correct delegate by given priority to the space delegate (eg cvx.eth).
  let delegate: string;
  if (protocol === "aura-bal") delegate = delegations[0].delegate;
  else {
    delegate = prioritizeDelegates(
      [delegations[0], delegations[1]],
      votes.map((v) => v.voter)
    )[0]?.delegate;
  }

  const scores = await snapshotService.getScores(protocol, block, [voter]);

  // Calculate the voting distribution of a user.
  const distribution = getVoteDistribution(
    proposal,
    voter,
    delegate,
    votes,
    scores
  );

  // Turn that voting distribution into personal pools bribed for dollars.
  bribed = getBribedPersonal(newEpoch, distribution);

  loading = false;
};

// Watches
watch(
  () => wallet.address,
  async (): Promise<void> => {
    if (epoch) {
      await onEpoch(epoch);
    }
  }
);

watch(
  () => epoch,
  async (newEpoch): Promise<void> => {
    await onEpoch(newEpoch ?? undefined);
  }
);
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.datatable-personal {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  ::v-deep(.header-title) {
    .personalDollarPerVlAsset {
      color: #a1a1aa;
      font-size: 0.75rem;
      margin-right: 1rem;
    }
  }

  ::v-deep(.personal-columns-data) {
    display: grid;
    grid-template-columns: 20px 1fr 3fr 2fr 2fr;

    // Right adjust number columns.
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>
