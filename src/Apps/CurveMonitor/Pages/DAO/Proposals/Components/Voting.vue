<template>
  <div class="voting">
    <VotingQuorum :proposal="proposal"></VotingQuorum>
    <VotingResults :proposal="proposal"></VotingResults>
    <VotingButtons :proposal="proposal"></VotingButtons>
  </div>
</template>

<script setup lang="ts">
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import VotingResults from "@CM/Pages/DAO/Proposals/Components/VotingResults.vue";
import VotingQuorum from "@CM/Pages/DAO/Proposals/Components/VotingQuorum.vue";
import VotingButtons from "@CM/Pages/DAO/Proposals/Components/VotingButtons.vue";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
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
