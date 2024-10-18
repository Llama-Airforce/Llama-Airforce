<script setup lang="ts">
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import VotingQuorum from "@PM/Pages/Proposals/Components/VotingQuorum.vue";
import VotingButtons from "@PM/Pages/Proposals/Components/VotingButtons.vue";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <div class="voting">
    <VotingQuorum :proposal></VotingQuorum>
    <VotingButtons :proposal></VotingButtons>
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
