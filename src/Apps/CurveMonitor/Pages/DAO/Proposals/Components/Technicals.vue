<template>
  <div class="technicals">
    <div class="technical">
      <div class="heading">{{ t("description") }}</div>
      <div class="description">{{ proposal.metadata }}</div>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedVoters = !expandedVoters"
      >
        {{ t("voters") }} ({{ numVoters ?? "?" }})
        <i
          class="fas fa-chevron-up expander"
          :class="{ expandedVoters }"
        ></i>
      </div>

      <!-- Make scroll, not collapsible -->
      <Collapsible :expanded="expandedVoters">
        <Voters
          v-if="proposalDetails"
          class="voters"
          :proposal="proposal"
          :proposal-details="proposalDetails"
        ></Voters>
      </Collapsible>
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
  </div>
</template>

<script setup lang="ts">
import { uniqWith } from "lodash";
import { type Proposal } from "@CM/Services/Proposal";
import { useQueryProposal } from "@CM/Services/Proposal/Queries";
import Voters from "@CM/Pages/DAO/Proposals/Components/Voters.vue";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
  expanded: boolean;
}

const { proposal, expanded = false } = defineProps<Props>();

// Refs
const expandedCallData = ref(true);
const expandedVoters = ref(proposal.voteCount > 0);

// Data
const { data: proposalDetails } = useQueryProposal(
  toRef(() => proposal.id),
  toRef(() => proposal.type),
  toRef(() => expanded)
);

const numVoters = computed(() => {
  if (proposalDetails.value) {
    return uniqWith(proposalDetails.value.votes, (x, y) => x.voter === y.voter)
      .length;
  }

  return null;
});

const callData = computed(() => {
  if (!proposalDetails.value) {
    return null;
  }

  return proposalDetails.value.script
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace("/\u251c/g", "├")
    .replace("/\u2500/g", "─")
    .replace(/0x[a-fA-F0-9]{40}/g, (match) =>
      /[A-F]/g.test(match) && isAddress(match)
        ? `<a href='https://etherscan.io/address/${match}'>${match}</a>`
        : match
    );
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.technicals {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;

  background-color: var(--c-lvl0);
  border: solid 1px var(--c-lvl3);
  border-radius: var(--border-radius);

  > .technical {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    > .heading {
      display: flex;
      align-items: end;
      gap: 0.5rem;
      color: var(--c-lvl6);
    }

    .expander {
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expandedCallData,
      &.expandedVoters {
        transform: rotate(180deg);
      }
    }

    .calldata {
      font-family: var(--font-mono);
    }

    .calldata,
    .voters {
      max-height: 20rem;
      overflow-y: auto;
      overflow-wrap: anywhere;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Description
calldata: Calldata
voters: Voters
</i18n>
