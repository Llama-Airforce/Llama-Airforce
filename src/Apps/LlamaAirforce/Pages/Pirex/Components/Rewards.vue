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
      <RewardsTable :rewards></RewardsTable>
      <Button
        value="Show Claims"
        :primary="true"
      ></Button>
    </div>

    <div
      v-else
      class="right no-data"
    >
      No rewards for {{ addressShort(address) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWallet, addressShort } from "@/Wallet";
import RewardsTable from "@LAF/Pages/Pirex/Components/RewardsTable.vue";

const { address } = useWallet();

const rewards = computed(() => [
  {
    symbol: "WETH",
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    amount: 0.0001,
    amountUsd: 0.52,
  },
  {
    symbol: "ALCX",
    address: "0xdbdb4d16eda451d0503b854cf79d55697f90c8df",
    amount: 0.0567,
    amountUsd: 1.43,
  },
  {
    symbol: "FXS",
    address: "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
    amount: 0.2124,
    amountUsd: 1.01,
  },
  {
    symbol: "PRISMA",
    address: "0xda47862a83dac0c112ba89c6abc2159b95afd71c",
    amount: 0.2091,
    amountUsd: 0.02,
  },
  {
    symbol: "PRISMA",
    address: "0xda47862a83dac0c112ba89c6abc2159b95afd71c",
    amount: 34534435,
    amountUsd: 539583798347,
  },
]);
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
