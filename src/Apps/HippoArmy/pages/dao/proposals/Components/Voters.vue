<script setup lang="ts">
import type { Proposal, ProposalVote } from "@HA/services/dao/schema";

const { proposal, votes } = defineProps<{
  proposal: Proposal;
  votes: ProposalVote[] | undefined;
}>();

const { address: walletAddress } = useAccount();

const votesFor = computed(() => {
  if (!votes) {
    return null;
  }

  return votes
    .filter((vote) => vote.weightYes)
    .orderBy((vote) => vote.weightYes, "desc");
});

const votesAgainst = computed(() => {
  if (!votes) {
    return null;
  }

  return votes
    .filter((vote) => vote.weightNo)
    .orderBy((vote) => vote.weightNo, "desc");
});

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
            {{ vote.voterEns || addressShort(vote.voter) }}
          </a>
        </div>

        <div class="amount">
          <AsyncValue
            type="dollar"
            :value="vote.weightYes"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="percentage">
          <AsyncValue
            type="percentage"
            :value="(vote.weightYes / proposal.weightYes) * 100"
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
            :value="(vote.weightNo / proposal.weightNo) * 100"
            :precision="0"
          />
        </div>
        <div class="amount">
          <AsyncValue
            type="dollar"
            :value="vote.weightNo"
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
            {{ vote.voterEns || addressShort(vote.voter) }}
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
      grid-template-columns: 1fr 4rem 4rem;

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
      grid-template-columns: 4rem 4rem 1fr;

      > .address {
        justify-content: end;
      }
    }
  }
}
</style>
