<script setup lang="ts">
import type { Proposal, ProposalDetails } from "@curvefi/prices-api/proposal";

const { proposal, proposalDetails } = defineProps<{
  proposal: Proposal;
  proposalDetails: ProposalDetails | undefined;
}>();

const { address: walletAddress } = useAccount();

const votesFor = computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return proposalDetails.votes
    .filter((vote) => vote.supports)
    .orderBy((vote) => vote.votingPower, "desc");
});

const votesAgainst = computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return proposalDetails.votes
    .filter((vote) => !vote.supports)
    .orderBy((vote) => vote.votingPower, "desc");
});

// Methods
const address = (address: string) => {
  const addressLowercase = address.toLocaleLowerCase();

  // Hardcoded for now, Convex has no ENS by the looks of it anyway.
  if (addressLowercase === "0x989aeb4d175e16225e39e87d0d97a3360524ad80") {
    return "Convex";
  } else if (
    addressLowercase === "0x52f541764e6e90eebc5c21ff570de0e2d63766b6"
  ) {
    return "StakeDAO";
  } else if (
    addressLowercase === "0xf147b8125d2ef93fb6965db97d6746952a133934"
  ) {
    return "Yearn";
  }

  return addressShort(address, 12);
};

const percentage = (voteWeight: number) =>
  (voteWeight / (proposal.votesFor + proposal.votesAgainst)) * 100;

const you = (address: string) => address === walletAddress.value;
</script>

<template>
  <div class="voters">
    <div class="for">
      <div class="title">For</div>

      <div
        v-for="vote in votesFor"
        :key="vote.voter"
        class="vote font-mono"
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
            type="dollar"
            :value="vote.votingPower"
            :precision="2"
            :show-symbol="false"
          />
        </div>
        <div class="percentage">
          <AsyncValue
            type="percentage"
            :value="percentage(vote.votingPower)"
            :precision="0"
          />
        </div>
      </div>
    </div>

    <div class="against">
      <div class="title">Against</div>

      <div
        v-for="vote in votesAgainst"
        :key="vote.voter"
        class="vote font-mono"
      >
        <div class="percentage">
          <AsyncValue
            type="percentage"
            :value="percentage(vote.votingPower)"
            :precision="0"
          />
        </div>
        <div class="amount">
          <AsyncValue
            type="dollar"
            :value="vote.votingPower"
            :precision="2"
            :show-symbol="false"
          />
        </div>
        <div class="address">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${vote.voter}`"
            :class="{ you: you(vote.voter) }"
          >
            {{ address(vote.voter) }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.voters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.25rem;
  gap: 2rem;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @container (max-width: 45rem) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .vote {
    .address {
      a {
        &.you {
          color: var(--c-purple);
        }
      }
    }
  }

  > .for,
  > .against {
    margin-right: 1rem;

    > .title {
      display: flex;
      grid-row: 1 / span 2;
      font-weight: bold;
    }

    > .vote {
      display: grid;
      gap: 1rem;

      > .amount,
      > .address,
      > .percentage {
        display: flex;
      }
    }
  }

  > .for {
    > .title {
      justify-content: end;
      color: var(--c-green);
    }

    > .vote {
      grid-template-columns: 1fr 5rem 4rem;

      > .amount,
      > .percentage {
        justify-content: end;
      }
    }
  }

  > .against {
    > .title {
      color: var(--c-red);
    }

    > .vote {
      grid-template-columns: 4rem 5rem 1fr;

      > .address {
        justify-content: end;
      }
    }
  }
}
</style>
