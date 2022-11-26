<template>
  <div class="voting">
    <VotingButtons :proposal="proposal"></VotingButtons>

    <VotingQuorum
      :proposal="proposal"
      :results="results"
    ></VotingQuorum>

    <VotingResults :results="results"></VotingResults>
  </div>
</template>

<script setup lang="ts">
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import type { Results } from "@/Pages/Curve/DAO/Proposals/Models/Results";
import VotingResults from "@/Pages/Curve/DAO/Proposals/Components/VotingResults.vue";
import VotingQuorum from "@/Pages/Curve/DAO/Proposals/Components/VotingQuorum.vue";
import VotingButtons from "@/Pages/Curve/DAO/Proposals/Components/VotingButtons.vue";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const results: Results = {
  token: "veCRV",
  choices: [
    { label: "for", amount: 453453 },
    { label: "against", amount: 151151 },
  ],
};

// Refs
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
