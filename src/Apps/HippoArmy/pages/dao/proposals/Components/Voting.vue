<script setup lang="ts">
import type { Proposal, ProposalVote } from "@HA/services/dao/schema";
import VotingQuorum from "./VotingQuorum.vue";
import VotingResults from "./VotingResults.vue";

const { votes } = defineProps<{
  proposal: Proposal;
  votes: ProposalVote[];
}>();
</script>

<template>
  <div class="voting">
    <VotingResults :votes />
    <VotingQuorum :proposal />
  </div>
</template>

<style scoped>
.voting {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  padding: 1rem;
  background-color: var(--c-lvl0);
  border: solid 1px var(--c-lvl3);
  border-radius: var(--border-radius);
}
</style>
