<template>
  <div class="proposal-details">
    <div class="proposal-details-container">
      <Technicals
        :proposal="proposal"
        :expanded="expanded"
      ></Technicals>

      <Voting :proposal="proposal"></Voting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Voting from "@PM/Pages/Proposals/Components/Voting.vue";
import Technicals from "@PM/Pages/Proposals/Components/Technicals.vue";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

// Props
interface Props {
  proposal: Proposal;
  expanded: boolean;
}

const { proposal, expanded = false } = defineProps<Props>();

// Refs
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
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
