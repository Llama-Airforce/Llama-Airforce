<script setup lang="ts">
import type { Proposal } from "@HA/services/dao/schema";
import ProposalDetails from "./ProposalDetails.vue";
import ProposalSummary from "./ProposalSummary.vue";

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
