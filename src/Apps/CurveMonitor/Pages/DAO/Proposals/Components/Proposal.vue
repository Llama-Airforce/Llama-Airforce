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

<script setup lang="ts">
import { type Proposal } from "@CM/Services/Proposal";
import ProposalSummary from "@CM/Pages/DAO/Proposals/Components/ProposalSummary.vue";
import ProposalDetails from "@CM/Pages/DAO/Proposals/Components/ProposalDetails.vue";

// Props
interface Props {
  proposal: Proposal;
  initExpanded?: boolean;
}

const { proposal, initExpanded = false } = defineProps<Props>();

// Refs
const expanded = ref(initExpanded);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.proposal {
  overflow: hidden;

  :deep(.card-body) {
    flex-direction: column;
  }
}

.proposal-details-collapsible {
  transition: grid-template-rows 125ms ease-out;
}
</style>
