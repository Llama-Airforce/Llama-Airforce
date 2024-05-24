<template>
  <div class="staking">
    <div class="left">
      <div class="title">Staking</div>

      <div class="info">
        Unstake <strong>spxCVX</strong> when staking period expires to get back
        your originally staked <strong>pxCVX</strong>.
      </div>

      <a
        href="https://docs.redacted.finance/products/pirex/convex/spxcvx-rfn-and-vfn-expert-mode"
        target="_blank"
      >
        Learn More
      </a>
    </div>

    <div
      v-if="stakes.length > 0"
      class="right"
    >
      <StakingTable :stakes></StakingTable>
    </div>

    <div
      v-else
      class="right no-data"
    >
      No current stakes for {{ addressShort(address) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWallet, addressShort } from "@/Wallet";
import StakingTable from "@LAF/Pages/Pirex/Components/StakingTable.vue";

const { address } = useWallet();

const stakes = computed(() => []);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.staking {
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
