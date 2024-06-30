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
      <RedemptionsUserTable :redemptions></RedemptionsUserTable>
    </div>

    <div
      v-else
      class="right no-data"
    >
      No pending redemptions for {{ addressShort(address) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { zip } from "lodash";
import { useWallet, addressShort } from "@/Wallet";
import { abi } from "@/ABI/Union/PirexUPxCvx";
import RedemptionsUserTable from "@LAF/Pages/Pirex/Components/RedemptionsUserTable.vue";

const { address } = useWallet();

// Pending redemptions
const tokenIds = computed((): bigint[] => []);
//const tokenIds = computed(() => [1720051200n, 1729123200n]);

const { data: balances } = useReadContract({
  abi,
  address: UPxCvxAddress,
  functionName: "balanceOfBatch",
  args: computed(
    () =>
      [
        Array(tokenIds.value.length).fill(address.value!),
        tokenIds.value,
      ] as const
  ),
  query: {
    enabled: computed(() => !!address.value),
    initialData: [],
    initialDataUpdatedAt: 0,
  },
});

const redemptions = computed(() => {
  if (!balances.value) {
    return [];
  }

  return zip(tokenIds.value, balances.value)
    .filter(
      ([tokenId, balance]) => tokenId !== undefined && balance !== undefined
    )
    .map(([tokenId, balance]) => ({
      tokenId: tokenId!,
      balance: balance!,
    }));
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions-user {
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
