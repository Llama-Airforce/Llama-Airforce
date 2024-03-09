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

const proposalService = new ProposalService(getHost());

// Refs
const route = useRoute();

// Data
const { loading, data: proposal } = usePromise(() => {
  const proposalIdParam = route.params.proposalId;
  if (proposalIdParam && typeof proposalIdParam === "string") {
    const proposalId = parseInt(proposalIdParam, 10);

    return minDelay(proposalService.getProposal(proposalId), 1000);
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
