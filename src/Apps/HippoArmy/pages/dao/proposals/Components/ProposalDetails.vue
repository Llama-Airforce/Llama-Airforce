<script setup lang="ts">
import { useProposalVotes } from "@HA/queries/dao";
import type { Proposal } from "@HA/services/dao/schema";
import Technicals from "./Technicals.vue";
import Voting from "./Voting.vue";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

const { data: votes } = useProposalVotes({
  proposal_id: proposal.proposalId,
});
</script>

<template>
  <div class="proposal-details">
    <div class="proposal-details-container">
      <Technicals
        :proposal
        :votes="votes ?? []"
      />

      <Voting :votes="votes ?? []" />
    </div>
  </div>
</template>

<style scoped>
.proposal-details {
  display: flex;
  flex-grow: 1;

  margin: 0 0.875rem 1.125rem 0.875rem;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }

  > .proposal-details-container {
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr minmax(auto, 250px);
    gap: var(--dashboard-gap);

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
