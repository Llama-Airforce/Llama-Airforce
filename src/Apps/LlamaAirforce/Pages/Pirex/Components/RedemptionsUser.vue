<script setup lang="ts">
import type { RedemptionPending } from "../Services";
import { useQueryRedemptions } from "../Services/Queries";
import RedemptionsUserTable from "./RedemptionsUserTable.vue";

const { address } = useAccount();

// Pending redemptions
const { data: redemptionsRaw, isLoading: loading } =
  useQueryRedemptions(address);

// Filter rewards claimed by the front-end.
const redeemed = ref([] as RedemptionPending[]);
const redemptions = computed(() =>
  redemptionsRaw.value.filter((x) => {
    const isAlreadyRedeemedByFrontEnd = redeemed.value.find(
      (redemption) =>
        redemption.tokenId === x.tokenId && redemption.balance === x.balance
    );

    const isDust = x.balance < 1000000000000n;

    return !isAlreadyRedeemedByFrontEnd && !isDust;
  })
);

function onRedeemed(redemption: RedemptionPending) {
  redeemed.value.push(redemption);
}
</script>

<template>
  <div class="redemptions-user">
    <div class="left">
      <div class="title">Redemptions</div>

      <div class="info">
        Your <strong>upxCVX</strong> holdings represent burned
        <strong>pxCVX</strong> used to initiate redemption of underlying
        <strong>CVX</strong>. You can redeem for underlying
        <strong>CVX</strong> anytime after the unlock date.
      </div>

      <a
        href="https://docs.redacted.finance/products/pirex/pxcvx/upxcvx-unlocking"
        target="_blank"
      >
        Learn More
      </a>
    </div>

    <div
      v-if="redemptions.length > 0"
      class="right"
    >
      <RedemptionsUserTable
        :redemptions
        :loading
        @redeemed="onRedeemed"
      />
    </div>

    <div
      v-else
      class="right no-data"
    >
      No pending redemptions for {{ addressShort(address) }}
    </div>
  </div>
</template>

<style scoped>
.redemptions-user {
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
