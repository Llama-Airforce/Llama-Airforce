<script setup lang="ts">
import type { Proposal } from "@curvefi/prices-api/proposal";
import VotingButtons from "./VotingButtons.vue";
import VotingQuorum from "./VotingQuorum.vue";
import VotingResults from "./VotingResults.vue";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <div class="voting">
    <VotingQuorum :proposal />
    <VotingResults :proposal />
    <VotingButtons :proposal />
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
