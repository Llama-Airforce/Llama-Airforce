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
@import "@/Styles/Variables.scss";
.proposal {
  :deep(.card-body) {
    flex-direction: column;
  }
}

.proposal-details-collapsible {
  transition: grid-template-rows 125ms ease-out;
}
</style>
