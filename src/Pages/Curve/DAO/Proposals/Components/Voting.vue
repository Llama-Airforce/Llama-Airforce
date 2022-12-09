<template>
  <div class="voting">
    <VotingButtons v-show="false"></VotingButtons>
    <VotingQuorum :proposal="proposal"></VotingQuorum>
    <VotingResults :proposal="proposal"></VotingResults>
  </div>
</template>

<script setup lang="ts">
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import VotingResults from "@/Pages/Curve/DAO/Proposals/Components/VotingResults.vue";
import VotingQuorum from "@/Pages/Curve/DAO/Proposals/Components/VotingQuorum.vue";
import VotingButtons from "@/Pages/Curve/DAO/Proposals/Components/VotingButtons.vue";

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
  background-color: #18181b;
  border: solid 1px #35353b;
}
</style>
