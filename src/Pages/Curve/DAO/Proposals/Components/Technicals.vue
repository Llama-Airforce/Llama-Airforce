<template>
  <div class="technicals">
    <div class="technical">
      <div class="heading">{{ t("description") }}</div>
      <div class="description">{{ proposal.metadata }}</div>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedCallData = !expandedCallData"
      >
        {{ t("calldata") }}
        <i
          class="fas fa-chevron-up expander"
          :class="{ expandedCallData }"
        ></i>
      </div>
      <Collapsible :expanded="expandedCallData">
        <div
          v-if="proposalDetails"
          class="calldata"
          v-html="callData"
        ></div>
      </Collapsible>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedVoters = !expandedVoters"
      >
        {{ t("voters") }} ({{ proposal.votes }})
        <i
          class="fas fa-chevron-up expander"
          :class="{ expandedVoters }"
        ></i>
      </div>

      <!-- Make scroll, not collabsible -->
      <Collapsible :expanded="expandedVoters">
        <Voters
          v-if="proposalDetails"
          class="voters"
          :proposal="proposal"
          :proposal-details="proposalDetails"
        ></Voters>
      </Collapsible>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Collapsible } from "@/Framework";
import Voters from "@/Pages/Curve/DAO/Proposals/Components/Voters.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import type { ProposalDetails } from "@/Pages/Curve/DAO/Proposals/Models/ProposalDetails";
import ProposalService from "@/Pages/Curve/DAO/Proposals/Services/ProposalService";
import { getHost } from "@/Services/Host";

const { t } = useI18n();

const proposalService = new ProposalService(getHost());

// Props
interface Props {
  proposal: Proposal;
  expanded: boolean;
}

const { proposal, expanded = false } = defineProps<Props>();

// Refs
let proposalDetails: ProposalDetails | null = $ref(null);
const expandedCallData = $ref(true);
const expandedVoters = $ref(false);

const callData = $computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return proposalDetails.script
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace("/\u251c/g", "├")
    .replace("/\u2500/g", "─");
});

// Watches
watch(
  () => expanded,
  async (expandedNew) => {
    if (expandedNew && proposalDetails === null) {
      proposalDetails = await proposalService.getProposalDetails(proposal);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.technicals {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;

  background-color: #18181b;
  border: solid 1px #35353b;

  > .technical {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    > .heading {
      display: flex;
      align-items: end;
      gap: 0.5rem;

      color: #a1a1aa;
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    .expander {
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expandedCallData,
      &.expandedVoters {
        transform: rotate(180deg);
      }
    }

    .calldata,
    .voters {
      max-height: 20rem;
      overflow-y: auto;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Description
calldata: Calldata
voters: Voters
</i18n>
