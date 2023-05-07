<template>
  <div class="voters">
    <div class="for">
      <div class="title">{{ t("for") }}</div>

      <div
        v-for="vote in votesFor"
        :key="vote.voter"
        class="vote"
      >
        <div class="address">
          <a
            :href="`https://etherscan.io/address/${vote.voter}`"
            target="_blank"
          >
            {{ address(vote.voter) }}
          </a>
        </div>
        <div class="amount">
          <AsyncValue
            :value="vote.stake"
            :precision="0"
            :show-symbol="false"
            type="dollar"
          />
        </div>
        <div class="percentage">
          <AsyncValue
            :value="percentage(vote.stake)"
            :precision="0"
            type="percentage"
          />
        </div>
      </div>
    </div>

    <div class="against">
      <div class="title">{{ t("against") }}</div>

      <div
        v-for="vote in votesAgainst"
        :key="vote.voter"
        class="vote"
      >
        <div class="percentage">
          <AsyncValue
            :value="percentage(vote.stake)"
            :precision="0"
            type="percentage"
          />
        </div>
        <div class="amount">
          <AsyncValue
            :value="vote.stake"
            :precision="0"
            :show-symbol="false"
            type="dollar"
          />
        </div>
        <div class="address">
          <a
            :href="`https://etherscan.io/address/${vote.voter}`"
            target="_blank"
          >
            {{ address(vote.voter) }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue } from "@/Framework";
import { addressShort } from "@/Wallet";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import type { ProposalDetails } from "@CM/Pages/DAO/Proposals/Models/ProposalDetails";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
  proposalDetails: ProposalDetails;
}

const { proposal, proposalDetails } = defineProps<Props>();

const votesFor = computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return chain(proposalDetails.votes)
    .filter((vote) => vote.supports)
    .orderBy((vote) => vote.stake, "desc")
    .value();
});

const votesAgainst = computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return chain(proposalDetails.votes)
    .filter((vote) => !vote.supports)
    .orderBy((vote) => vote.stake, "desc")
    .value();
});

// Methods
const address = (address: string): string => {
  // Hardcoded for now, Convex has no ENS by the looks of it anyway.
  if (address === "0x989aeb4d175e16225e39e87d0d97a3360524ad80") {
    return "Convex";
  }

  return addressShort(address, 12);
};

const percentage = (voteWeight: number): number => {
  return (voteWeight / (proposal.votesFor + proposal.votesAgainst)) * 100;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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

  .vote {
    font-family: monospace;
  }

  > .for,
  > .against {
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
      grid-template-columns: 0.7fr 0.15fr 0.15fr;

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
      grid-template-columns: 0.15fr 0.15fr 0.7fr;

      > .address {
        justify-content: end;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
for: For
against: Against
</i18n>
