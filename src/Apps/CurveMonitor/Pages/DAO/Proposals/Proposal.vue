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
import { useRoute } from "vue-router";
import { Spinner, usePromise } from "@/Framework";
import { minDelay } from "@/Util";
import { getHost } from "@/Services/Host";
import ProposalComponent from "@CM/Pages/DAO/Proposals/Components/Proposal.vue";
import ProposalService from "@CM/Pages/DAO/Proposals/Services/ProposalService";
import { type ProposalType, proposalTypes } from "./Models/Proposal";

const proposalService = new ProposalService(getHost());

// Refs
const route = useRoute();

// Data
const { loading, data: proposal } = usePromise(() => {
  const proposalTypeParam = route.params.proposalType;
  const proposalIdParam = route.params.proposalId;

  if (
    proposalTypeParam &&
    typeof proposalTypeParam === "string" &&
    proposalIdParam &&
    typeof proposalIdParam === "string"
  ) {
    if (!proposalTypes.includes(proposalTypeParam as ProposalType)) {
      return Promise.resolve(null);
    }

    const proposalType = proposalTypeParam as ProposalType;
    const proposalId = parseInt(proposalIdParam, 10);

    return minDelay(
      proposalService.getProposal(proposalId, proposalType),
      1000
    );
  }

  return Promise.resolve(null);
}, null);
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
