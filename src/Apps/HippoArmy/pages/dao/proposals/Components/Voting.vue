<script setup lang="ts">
import type { ProposalVote } from "@HA/services/dao/schema";
import VotingResults from "./VotingResults.vue";

const { votes } = defineProps<{
  votes: ProposalVote[];
}>();
</script>

<template>
  <div class="voting">
    <VotingResults :votes />
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
