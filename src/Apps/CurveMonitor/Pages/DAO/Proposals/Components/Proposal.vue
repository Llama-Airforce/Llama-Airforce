<script setup lang="ts">
import { type Proposal } from "@CM/Services/Proposal";
import ProposalSummary from "@CM/Pages/DAO/Proposals/Components/ProposalSummary.vue";
import ProposalDetails from "@CM/Pages/DAO/Proposals/Components/ProposalDetails.vue";

const { proposal, initExpanded = false } = defineProps<{
  proposal: Proposal;
  initExpanded?: boolean;
}>();

// Refs
const expanded = ref(initExpanded);
</script>

<template>
  <Card
    class="proposal"
    :compact="true"
  >
    <ProposalSummary
      :proposal="proposal"
      :expanded="expanded"
      @toggle-expand="expanded = !expanded"
    ></ProposalSummary>

    <Collapsible
      class="proposal-details-collapsible"
      :expanded="expanded"
    >
      <ProposalDetails
        :proposal="proposal"
        :expanded="expanded"
      ></ProposalDetails>
    </Collapsible>
  </Card>
</template>

<style lang="scss" scoped>
.proposal-details-collapsible {
  transition: grid-template-rows 125ms ease-out;
}
</style>
