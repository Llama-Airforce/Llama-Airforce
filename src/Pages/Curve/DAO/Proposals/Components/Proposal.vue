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

    <Collapsible :expanded="expanded">
      <ProposalDetails
        v-if="expanded"
        :proposal="proposal"
        :expanded="expanded"
      ></ProposalDetails>
    </Collapsible>
  </Card>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import Card from "@/Framework/Card.vue";
import Collapsible from "@/Framework/Collapsible.vue";
import ProposalSummary from "@/Pages/Curve/DAO/Proposals/Components/ProposalSummary.vue";
import ProposalDetails from "@/Pages/Curve/DAO/Proposals/Components/ProposalDetails.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const expanded = $ref(false);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.proposal {
  max-width: 1088px;

  ::v-deep(.card-body) {
    flex-direction: column;
  }
}
</style>
