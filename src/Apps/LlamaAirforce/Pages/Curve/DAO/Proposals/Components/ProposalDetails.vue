<template>
  <div class="details">
    <div class="details-container">
      <Technicals
        :proposal="proposal"
        :expanded="expanded"
      ></Technicals>

      <Voting :proposal="proposal"></Voting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Voting from "@LAF/Pages/Curve/DAO/Proposals/Components/Voting.vue";
import Technicals from "@LAF/Pages/Curve/DAO/Proposals/Components/Technicals.vue";
import type { Proposal } from "@LAF/Pages/Curve/DAO/Proposals/Models/Proposal";

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
.details {
  display: flex;
  flex-grow: 1;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }

  margin: 1rem 2rem;
  padding-bottom: 0.5rem;
  border-top: solid 1px var(--c-lvl4);

  > .details-container {
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr minmax(auto, 250px);
    gap: var(--dashboard-gap);

    margin-top: 2rem;
  }
}
</style>
