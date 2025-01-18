<script setup lang="ts">
import type { Proposal } from "@CM/Services/proposal";
import ProposalSummary from "@CM/Pages/DAO/Proposals/Components/ProposalSummary.vue";
import ProposalDetails from "@CM/Pages/DAO/Proposals/Components/ProposalDetails.vue";

const { proposal, initExpanded = false } = defineProps<{
  proposal: Proposal;
  initExpanded?: boolean;
}>();

const expanded = ref(initExpanded);
</script>

<template>
  <Card
    compact
    class="proposal"
  >
    <ProposalSummary
      :proposal
      :expanded
      @toggle-expand="expanded = !expanded"
    />

    <Collapsible
      class="proposal-details-collapsible"
      :expanded
    >
      <ProposalDetails
        :proposal
        :expanded
      />
    </Collapsible>
  </Card>
</template>

<style scoped>
.proposal-details-collapsible {
  transition: grid-template-rows 125ms ease-out;
}
</style>
