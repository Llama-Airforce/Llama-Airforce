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
      ></RewardsTable>

      <Button
        value="Show Claims"
        :primary="true"
        @click="showClaims = true"
      ></Button>
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
      :prices="pricesData!"
      @close="showClaims = false"
      @claimed="onClaimed"
    ></ModalClaim>
  </div>
</template>

<script setup lang="ts">
import { useWallet, addressShort } from "@/Wallet";
import { useQueryPrices } from "@/Services/DefiLlamaQuery";
import RewardsTable from "@LAF/Pages/Pirex/Components/RewardsTable.vue";
import { type Claim, calculateRewards } from "@LAF/Pages/Pirex/Services";
import { useQueryRewards } from "@LAF/Pages/Pirex/Services/Queries";
import ModalClaim from "@LAF/Pages/Pirex/Components/ModalClaim.vue";

const showClaims = ref(false);

const { address } = useWallet();

const { data: snapshotsRaw, isLoading: snapshotsLoading } =
  useQueryRewards(address);

// Filter rewards claimed by the front-end.
const claimed = ref([] as Claim[]);
const snapshots = computed(() =>
  snapshotsRaw.value.filter((x) => {
    const isAlreadyClaimedByFrontEnd = claimed.value.find(
      (claim) => claim.epoch === x.epoch && claim.rewardIndex === x.rewardIndex
    );

    return !isAlreadyClaimedByFrontEnd;
  })
);

const tokens = computed(() => [
  ...new Set(snapshots.value.map((x) => x.address)),
]);

const { data: pricesData, isLoading: pricesLoading } = useQueryPrices(tokens);

const rewards = computed(() => {
  if (!pricesData.value) {
    return [];
  }

  return calculateRewards(snapshots.value, pricesData.value);
});

const loading = computed(() => snapshotsLoading.value || pricesLoading.value);

function onClaimed(claims: Claim[]) {
  claimed.value.push(...claims);
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.rewards {
  display: grid;
  gap: var(--dashboard-gap);
  grid-template-columns: 1fr 1fr;

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
