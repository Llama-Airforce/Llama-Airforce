<template>
  <div class="voters">
    <div
      v-for="vote in votes"
      :key="vote.voter"
      class="vote"
    >
      <div class="address">
        <a
          target="_blank"
          :href="`https://etherscan.io/address/${vote.voter}`"
          :class="{ you: you(vote.voter) }"
        >
          {{ address(vote.voter) }}
        </a>
      </div>
      <div class="amount">
        <AsyncValue
          :value="vote.weight"
          :precision="2"
          :show-symbol="false"
          type="dollar"
        />
      </div>
      <div class="percentage">
        <AsyncValue
          :value="percentage(vote.weight)"
          :precision="0"
          type="percentage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort, useWallet } from "@/Wallet";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Refs
const { address: walletAddress } = useWallet();

const votes = computed(() => {
  return chain(proposal.voters)
    .orderBy((vote) => vote.weight, "desc")
    .value();
});

// Methods
const address = (address: string): string => {
  // Hardcoded for now, Convex has no ENS by the looks of it anyway.
  if (address === "0x989aeb4d175e16225e39e87d0d97a3360524ad80") {
    return "Convex";
  } else if (address === "0x52f541764e6e90eebc5c21ff570de0e2d63766b6") {
    return "StakeDAO";
  } else if (address === "0xf147b8125d2ef93fb6965db97d6746952a133934") {
    return "Yearn";
  }

  return addressShort(address, 12);
};

const percentage = (voteWeight: number): number => {
  return (voteWeight / proposal.weightReceived) * 100;
};

const you = (address: string): boolean => address === walletAddress.value;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.voters {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.25rem;
  gap: 0.25rem;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .vote {
    font-family: var(--font-mono);

    .address {
      a {
        &.you {
          color: var(--c-purple);
        }
      }
    }
  }

  > .vote {
    display: grid;
    grid-template-columns: 0.25fr 0.15fr 0.15fr;
    gap: 1rem;

    > .amount,
    > .address,
    > .percentage {
      display: flex;
    }
  }
}
</style>
