<script setup lang="ts">
import type { Proposal, ProposalVote } from "@HA/services/dao/schema";
import Voters from "./Voters.vue";

const { proposal, votes } = defineProps<{
  proposal: Proposal;
  votes: ProposalVote[];
}>();

const expandedCallData = ref(true);
const expandedVoters = ref(proposal.votersCount > 0);

const numVoters = computed(
  () => votes.uniqWith((x, y) => x.voter === y.voter).length
);

const callData = computed(() =>
  proposal.actions
    .reduce((acc, x) => acc + x.decodedCalldata, "")
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace("/\u251c/g", "├")
    .replace("/\u2500/g", "─")
    .replace(/0x[a-fA-F0-9]{40}/g, (match) =>
      /[A-F]/g.test(match) && isAddress(match)
        ? `<a target='_blank' href='https://etherscan.io/address/${match}'>${match}</a>`
        : match
    )
);
</script>

<template>
  <div class="technicals">
    <div class="technical">
      <div class="heading">Description</div>
      <div class="description">DESCRIPTION TODO</div>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedVoters = !expandedVoters"
      >
        Voters ({{ numVoters ?? "?" }})
        <LucideChevronUp
          class="expander"
          :class="{ expandedVoters }"
        />
      </div>

      <!-- Make scroll, not collapsible -->
      <Collapsible :expanded="expandedVoters">
        <Voters
          v-if="proposal"
          class="voters"
          :proposal
          :votes
        />
      </Collapsible>
    </div>

    <div class="technical">
      <div class="heading">Creation transaction</div>
      <a
        style="align-self: start"
        target="_blank"
        :href="`https://etherscan.io/tx/${proposal.creationTxHash}`"
      >
        {{ proposal.creationTxHash }}
      </a>
    </div>

    <div
      v-if="!!proposal?.executionTx"
      class="technical"
    >
      <div class="heading">Execution transaction</div>
      <a
        style="align-self: start"
        target="_blank"
        :href="`https://etherscan.io/tx/${proposal.executionTx}`"
      >
        {{ proposal.executionTx }}
      </a>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedCallData = !expandedCallData"
      >
        Calldata
        <LucideChevronUp
          class="expander"
          :class="{ expandedCallData }"
        />
      </div>

      <Collapsible :expanded="expandedCallData">
        <div
          class="calldata font-mono"
          v-html="callData"
        ></div>
      </Collapsible>
    </div>
  </div>
</template>

<style scoped>
.technicals {
  container-type: inline-size;

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
    overflow-wrap: anywhere;

    > .heading {
      display: flex;
      align-items: center;
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

    .calldata,
    .voters {
      max-height: 20rem;
      overflow-y: auto;
    }
  }
}
</style>
