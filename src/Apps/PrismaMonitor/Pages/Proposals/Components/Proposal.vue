<script setup lang="ts">
import ProposalSummary from "@PM/Pages/Proposals/Components/ProposalSummary.vue";
import ProposalDetails from "@PM/Pages/Proposals/Components/ProposalDetails.vue";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

const expanded = ref(false);
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
