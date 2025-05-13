<script setup lang="ts">
import { useProposal } from "@HA/queries/dao";
import ProposalComponent from "./Components/Proposal.vue";

const proposalId = useRouteParams("proposalId", 0, { transform: Number });

const { isFetching: loading, data: proposal } = useProposal({
  proposal_id: proposalId.value,
});

const CRUMB_LENGTH = 50;
const { crumbs } = storeToRefs(useBreadcrumbStore());
watch(
  proposal,
  (proposal) => {
    crumbs.value = [
      {
        id: "proposals",
        label: "Proposals",
        pathName: "proposals",
      },
      {
        id: "proposal",
        label: `Proposals: ${
          proposal?.description
            ? proposal.description.length > CRUMB_LENGTH
              ? `${proposal.description.substring(0, CRUMB_LENGTH)}...`
              : proposal.description
            : "?"
        }`,
      },
    ];
  },
  { immediate: true }
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
