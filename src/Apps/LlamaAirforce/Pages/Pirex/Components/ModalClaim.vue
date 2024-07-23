<template>
  <Modal @close="emit('close')">
    <Card title="Convex Rewards">
      <div class="epochs">
        <div class="headers">
          <div>Epoch</div>
          <div>Total Claimable</div>
        </div>

        <div
          v-for="epoch in epochs"
          :key="epoch.epoch"
          class="epoch"
          :class="{ expanded: isExpanded(epoch) }"
          @click="onToggle(epoch)"
        >
          <div class="info">
            <div class="data">{{ formatDate(epoch.epoch) }}</div>

            <AsyncValue
              :inline="false"
              :value="total(epoch)"
              type="dollar"
            ></AsyncValue>

            <div class="chevron">
              <div
                class="expander"
                :class="{ expanded: isExpanded(epoch) }"
              >
                <i class="fas fa-chevron-up"></i>
              </div>
            </div>
          </div>

          <Collapsible
            class="rewards-collapsible"
            :expanded="isExpanded(epoch)"
            @click.stop
          >
            <div class="epoch-details">
              <RewardsTable
                :rewards="rewards[epoch.epoch]"
                :can-select="true"
                :selected="toClaim[epoch.epoch]"
                @select="onRewardToggle(epoch, $event)"
              ></RewardsTable>

              <Button
                :primary="true"
                :disabled="claiming || !canClaim(epoch)"
                @click="claim(epoch)"
              >
                Claim
              </Button>
            </div>
          </Collapsible>
        </div>
      </div>
    </Card>
  </Modal>
</template>

<script setup lang="ts">
import { type Address } from "viem";
import { chain } from "lodash";
import { abi } from "@/ABI/Union/Pirex";
import { useWallet } from "@/Wallet";
import { type Price } from "@/Services";
import {
  type SnapshotReward,
  type Reward,
  type Claim,
  calculateSnapshotRewards,
  isSnapshotReward,
} from "@LAF/Pages/Pirex/Services";
import RewardsTable from "@LAF/Pages/Pirex/Components/RewardsTable.vue";

// Props
interface Props {
  snapshots: SnapshotReward[];
  prices: Record<Address, Price | undefined>;
}

const { snapshots, prices } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  claimed: [claims: Claim[]];
}>();

const { address } = useWallet();

// Formatters
function formatDate(epoch: number): string {
  const date = new Date(epoch * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Rewards
const epochs = computed(() => {
  return chain(snapshots)
    .groupBy((x) => x.epoch)
    .map((group) => ({
      epoch: group[0].epoch,
      snapshots: group,
    }))
    .value();
});

type Epoch = (typeof epochs)["value"][number];
const rewards = computed(() =>
  Object.fromEntries(
    epochs.value.map((epoch) => [
      epoch.epoch,
      calculateSnapshotRewards(epoch.snapshots, prices),
    ])
  )
);

function total(epoch: Epoch) {
  const epochRewards = rewards.value[epoch.epoch];
  return epochRewards.reduce((acc, x) => acc + x.amountUsd, 0);
}

// Expanding
const expanded = ref<number[]>([]);
function onToggle(epoch: Epoch) {
  if (isExpanded(epoch)) {
    expanded.value = expanded.value.filter((e) => e !== epoch.epoch);
  } else {
    expanded.value.push(epoch.epoch);
  }

  // Check all rewards on when expanded for the first time
  if (!toClaim[epoch.epoch]) {
    toClaim[epoch.epoch] = rewards.value[epoch.epoch];
  }
}

function isExpanded(epoch: Epoch) {
  return expanded.value.includes(epoch.epoch);
}

// Claiming rewards
const toClaim: Record<number, Reward[]> = reactive({});

function onRewardToggle(epoch: Epoch, reward: Reward) {
  if (toClaim[epoch.epoch].map((r) => r.address).includes(reward.address)) {
    toClaim[epoch.epoch] = toClaim[epoch.epoch].filter(
      (r) => r.address !== reward.address
    );
  } else {
    toClaim[epoch.epoch].push(reward);
  }
}

function canClaim(epoch: Epoch) {
  return !!address.value && (toClaim[epoch.epoch]?.length ?? 0) > 0;
}

let claimsClaiming: Claim[] = [];
const { execute: claim, isExecuting: claiming } = useExecuteContract(
  (writeContract, epoch: Epoch) => {
    // Get all the reward indices of the claims for the given epoch.
    const claims = toClaim[epoch.epoch]
      .filter((x) => isSnapshotReward(x))
      .flatMap((x) => x.claims.filter((claim) => claim.epoch === epoch.epoch));

    const rewardIndices = claims.map((r) => BigInt(r.rewardIndex));

    claimsClaiming = claims;

    writeContract({
      address: PirexCvxAddress,
      abi,
      functionName: "redeemSnapshotRewards",
      args: [BigInt(epoch.epoch), rewardIndices, address.value!] as const,
    });
  },
  {
    successMessage: `Successfully claimed rewards for epoch: ${
      claimsClaiming[0]?.epoch ?? "?"
    }!`,
    onSuccess: () => {
      claimsClaiming = [];
    },
    onError: () => {
      claimsClaiming = [];
    },
  }
);
</script>

<style lang="scss">
.modal:has(.rewards-collapsible) {
  .modal-popup {
    position: absolute;
    top: 5rem;
  }
}
</style>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.epochs {
  width: 33vw;
  max-height: 75dvh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;

  @media only screen and (max-width: 1280px) {
    width: 80vw;
  }

  > .headers {
    display: grid;
    grid-template-columns: auto 1fr 5rem;
    margin-left: 1rem;

    font-size: 1rem;
    font-weight: bold;

    div:nth-child(2) {
      justify-self: end;
    }
  }

  > .epoch {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &.expanded {
      background-color: var(--c-lvl2);

      > .info {
        font-weight: bold;
      }
    }

    > .rewards-collapsible {
      transition: grid-template-rows 125ms ease-out;
    }

    > .info {
      display: grid;
      grid-template-columns: auto 1fr 5rem;

      margin: 0.5rem 0;
      margin-left: 1rem;

      div:nth-child(2) {
        justify-self: end;
      }

      > .chevron {
        display: flex;
        justify-self: center;

        > .expander {
          transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
          transform: rotate(90deg);
          font-size: 0.75rem;

          &.expanded {
            transform: rotate(180deg);
          }
        }
      }
    }

    &:hover {
      > .info {
        font-weight: bold;
      }
    }

    .epoch-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      div:nth-child(1) {
        background-color: var(--c-lvl2);
      }

      > button {
        align-self: end;
        margin-right: 1rem;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
