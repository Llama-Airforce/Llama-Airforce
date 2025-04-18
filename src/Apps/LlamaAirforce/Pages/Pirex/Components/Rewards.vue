<script setup lang="ts">
import { useQueryPrices } from "@/Services/PriceQuery";
import {
  type Claim,
  calculateFuturesRewards,
  calculateSnapshotRewards,
  sumRewards,
} from "../Services";
import { useQueryRewards } from "../Services/Queries";
import ModalClaim from "./ModalClaim.vue";
import RewardsTable from "./RewardsTable.vue";

const showClaims = ref(false);

const { address } = useAccount();

const { data: rewardsRaw, isFetching: snapshotsLoading } =
  useQueryRewards(address);

// Filter rewards claimed by the front-end.
const claimed = ref([] as Claim[]);
const snapshots = computed(() =>
  rewardsRaw.value.snapshotRewards.filter((x) => {
    const isAlreadyClaimedByFrontEnd = claimed.value.find(
      (claim) => claim.epoch === x.epoch && claim.rewardIndex === x.rewardIndex
    );

    return !isAlreadyClaimedByFrontEnd;
  })
);

const futures = computed(() => rewardsRaw.value.futuresRewards);

const tokens = computed(() => [
  ...new Set([
    ...snapshots.value.map((x) => x.address),
    ...futures.value.map((x) => x.address),
  ]),
]);

const { data: pricesData, isLoading: pricesLoading } = useQueryPrices(tokens);

const rewards = computed(() => {
  if (!pricesData.value) {
    return [];
  }

  const rewardsSnapshot = calculateSnapshotRewards(
    snapshots.value,
    pricesData.value
  );

  const rewardsFutures = calculateFuturesRewards(
    futures.value,
    pricesData.value
  );

  return sumRewards(rewardsSnapshot, rewardsFutures);
});

const loading = computed(() => snapshotsLoading.value || pricesLoading.value);

function onClaimed(claims: Claim[]) {
  claimed.value.push(...claims);
}
</script>

<template>
  <div class="rewards">
    <div class="left">
      <div class="title">Rewards</div>

      <div class="info">
        Depositors are eligible to claim rewards for their
        <strong>pxCVX</strong> holdings at the epoch timestamp. Rewards are
        distributed based on a snapshot of <strong>pxCVX</strong> balances,
        taken at the timestamp of each epoch. Claims for
        <strong>RFN</strong> and pending unlocks are also available here.
      </div>

      <a
        href="https://docs.redacted.finance/products/pirex/convex/pxcvx-standard-mode"
        target="_blank"
      >
        Learn More
      </a>
    </div>

    <div
      v-if="rewards.length > 0"
      class="right"
    >
      <RewardsTable
        :rewards
        :loading
      />

      <Button
        class="primary"
        @click="showClaims = true"
      >
        Show Claims
      </Button>
    </div>

    <div
      v-else
      class="right no-data"
    >
      No rewards for {{ addressShort(address) }}
    </div>

    <ModalClaim
      v-if="rewards.length > 0"
      :show="showClaims"
      :snapshots
      :futures
      :prices="pricesData!"
      @close="showClaims = false"
      @claimed="onClaimed"
    />
  </div>
</template>

<style scoped>
.rewards {
  display: grid;
  gap: var(--dashboard-gap);
  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }

  > .left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.75rem;

    > .title {
      font-weight: bold;
    }

    > .info {
      align-items: center;
      text-wrap: pretty;
    }

    > a {
      align-self: flex-start;
    }
  }

  > .right {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    &.no-data {
      place-content: center;
      text-align: center;
    }

    button {
      justify-content: center;
    }
  }
}
</style>
