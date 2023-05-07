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
import { ref } from "vue";
import { Card, Collapsible } from "@/Framework";
import ProposalSummary from "@CM/Pages/DAO/Proposals/Components/ProposalSummary.vue";
import ProposalDetails from "@CM/Pages/DAO/Proposals/Components/ProposalDetails.vue";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const expanded = ref(false);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.proposal {
  ::v-deep(.card-body) {
    flex-direction: column;
  }
}

.proposal-details-collapsible {
  transition: grid-template-rows 125ms ease-out;
}
</style>
