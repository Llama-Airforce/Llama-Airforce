<template>
  <div class="proposal-container">
    <Spinner
      class="spinner"
      :class="{ loading }"
    ></Spinner>

    <ProposalComponent
      v-if="!loading && proposal"
      :proposal="proposal"
      :init-expanded="true"
    ></ProposalComponent>
  </div>
</template>

<script setup lang="ts">
import { type ProposalType } from "@CM/Services/Proposal";
import { useQueryProposal } from "@CM/Services/Proposal/Queries";
import ProposalComponent from "@CM/Pages/DAO/Proposals/Components/Proposal.vue";

// Refs
const proposalId = useRouteParams("proposalId", 0, { transform: Number });
const proposalType = useRouteParams<ProposalType>("proposalType");

// Data
const { isFetching: loading, data: proposal } = useQueryProposal(
  proposalId,
  proposalType
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("proposal-container");

.proposal-container {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);

    @include loading-spinner();
  }
}
</style>
