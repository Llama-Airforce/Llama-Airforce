<script setup lang="ts">
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import VotingQuorum from "@PM/Pages/Proposals/Components/VotingQuorum.vue";
import VotingButtons from "@PM/Pages/Proposals/Components/VotingButtons.vue";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();
</script>

<template>
  <div class="voting">
    <VotingQuorum :proposal="proposal"></VotingQuorum>
    <VotingButtons :proposal="proposal"></VotingButtons>
  </div>
</template>

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
