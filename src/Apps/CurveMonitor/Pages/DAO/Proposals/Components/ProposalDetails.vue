<script setup lang="ts">
import { type Proposal } from "@CM/Services/Proposal";
import Voting from "@CM/Pages/DAO/Proposals/Components/Voting.vue";
import Technicals from "@CM/Pages/DAO/Proposals/Components/Technicals.vue";

const { proposal, expanded = false } = defineProps<{
  proposal: Proposal;
  expanded: boolean;
}>();
</script>

<template>
  <div class="proposal-details">
    <div class="proposal-details-container">
      <Technicals
        :proposal
        :expanded
      ></Technicals>

      <Voting :proposal></Voting>
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
