<template>
  <DataTable
    class="datatable-bribe-personal"
    columns-header="1fr auto"
    columns-data="personal-columns-data"
    :rows="bribedOrdered"
    :columns="['', '%', t('pool'), `$/${vlAssetSymbol(protocol)}`, t('total')]"
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
          </div>
        </template>

        <div class="tooltip-hover">
          {{ pool(props.item) }}
        </div>
      </Tooltip>
    </template>

    <template #no-data>
      <div v-if="loading">{{ t("loading") }} {{ voterShort }}</div>
      <WalletConnectButton
        v-if="!connected"
        @connected="onConnected"
      ></WalletConnectButton>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { orderBy } from "lodash";
import { AsyncValue, DataTable, SortOrder, Tooltip } from "@/Framework";
import { icon } from "@/Util";
import { useWalletStore, addressShort } from "@/Wallet";
import WalletConnectButton from "@/Wallet/WalletConnectButton.vue";
import type { Epoch, Protocol, BribedPersonal } from "@LAF/Pages/Bribes/Models";
import SnapshotService, {
  Delegation,
} from "@LAF/Pages/Bribes/Rounds/Services/SnapshotService";
import AuraService from "@LAF/Pages/Bribes/Rounds/Services/AuraService";
import {
  getBribedPersonal,
  getVoteDistribution,
  prioritizeDelegates,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getHost } from "@/Services/Host";

const snapshotService = new SnapshotService(getHost());
const auraService = new AuraService(getHost());

const { t } = useI18n();

// Refs
const store = useBribesStore();
const wallet = useWalletStore();

const sortColumn = ref<"pool" | "vlasset" | "total">("total");
const sortOrder = ref(SortOrder.Descending);

const bribed = ref<BribedPersonal[]>([]);
const voter = ref("");
const loading = ref(false);

const epoch = computed((): Epoch | null => {
  return store.selectedEpoch;
});

const protocol = computed((): Protocol | null => {
  return store.selectedProtocol;
});

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
    sortOrder.value === SortOrder.Descending ? "desc" : "asc"
  );
});

const voterShort = computed((): string => {
  return addressShort(voter.value);
});

const connected = computed((): boolean => {
  return wallet.connected;
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

// Events
const onConnected = async (): Promise<void> => {
  if (epoch.value) {
    await onEpoch(epoch.value);
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
  sortColumn.value = columnName as "pool" | "vlasset" | "total";
  sortOrder.value = order;
};

const onEpoch = async (newEpoch?: Epoch): Promise<void> => {
  bribed.value = [];

  if (!wallet.address) return;
  voter.value = wallet.address;

  if (!newEpoch || !protocol.value) {
    return;
  }

  loading.value = true;

  const proposal = await snapshotService.getProposal(newEpoch.proposal);
  const block = parseInt(proposal.snapshot, 10);

  let delegations: Delegation[];

  if (protocol.value === "aura-bal")
    delegations = [await auraService.getDelegation(voter.value, block)];
  else {
    delegations = await snapshotService.getDelegations(block, {
      delegators: [voter.value],
      space: "cvx.eth",
    });
  }

  const votes = await snapshotService.getVotes(newEpoch.proposal, [
    voter.value,
    ...delegations.map((d) => d.delegate),
  ]);

  // Find the correct delegate by given priority to the space delegate (eg cvx.eth).
  let delegate: string;
  if (protocol.value === "aura-bal") delegate = delegations[0].delegate;
  else {
    delegate = prioritizeDelegates(
      [delegations[0], delegations[1]],
      votes.map((v) => v.voter)
    )[0]?.delegate;
  }

  const scores = await snapshotService.getScores(protocol.value, block, [
    voter.value,
  ]);

  // Calculate the voting distribution of a user.
  const distribution = getVoteDistribution(
    proposal,
    voter.value,
    delegate,
    votes,
    scores
  );

  // Turn that voting distribution into personal pools bribed for dollars.
  bribed.value = getBribedPersonal(newEpoch, distribution);

  loading.value = false;
};

// Watches
watch(
  () => wallet.address,
  async (): Promise<void> => {
    if (epoch.value) {
      await onEpoch(epoch.value);
    }
  }
);

watch(epoch, async (newEpoch): Promise<void> => {
  await onEpoch(newEpoch ?? undefined);
});
</script>

<style lang="scss" scoped>
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

  ::v-deep(.tooltip) {
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
          grid-template-columns: 20px 1fr 3fr 2fr 2fr;

          // Right adjust number columns.
          div:nth-child(4),
          div:nth-child(5) {
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