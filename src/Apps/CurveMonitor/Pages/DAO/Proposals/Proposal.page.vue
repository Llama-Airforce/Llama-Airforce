<script setup lang="ts">
import { useQueryProposal } from "@CM/queries/proposal";
import type { ProposalType } from "@curvefi/prices-api/proposal";
import ProposalComponent from "./Components/Proposal.vue";

const proposalId = useRouteParams("proposalId", 0, { transform: Number });
const proposalType = useRouteParams<ProposalType>("proposalType");

// Data
const { isFetching: loading, data: proposal } = useQueryProposal(
  proposalId,
  proposalType
);
</script>

<template>
  <div class="dashboard">
    <Spinner :loading />

    <ProposalComponent
      v-if="!loading && proposal"
      init-expanded
      :proposal
    />
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;

  display: flex;
  flex-direction: column;

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
