<script setup lang="ts">
import Voters from "@PM/Pages/Proposals/Components/Voters.vue";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
  expanded: boolean;
}>();

// Refs
const expandedCallData = ref(true);
const expandedVoters = ref(proposal.votes > 0);

const authorUrl = computed(() => {
  return `https://twitter.com/@${proposal.metadata!.author}`;
});

const numVoters = computed(
  () => proposal.voters.map((v) => v.voter).uniqWith((x, y) => x === y).length
);

const callData = computed(() => {
  return proposal.script
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

<template>
  <div class="technicals">
    <div
      v-if="proposal.metadata?.author"
      class="technical"
    >
      <div class="heading">{{ t("author") }}</div>
      <div class="description">
        <a
          :href="authorUrl"
          target="_blank"
        >
          {{ proposal.metadata.author }}
        </a>
      </div>
    </div>

    <div
      v-if="proposal.metadata?.link"
      class="technical"
    >
      <div class="heading">{{ t("link") }}</div>
      <div class="description">
        <a
          :href="proposal.metadata.link"
          target="_blank"
        >
          {{ proposal.metadata.link }}
        </a>
      </div>
    </div>

    <div
      v-if="proposal.metadata?.description"
      class="technical"
    >
      <div class="heading">{{ t("description") }}</div>
      <div class="description">{{ proposal.metadata?.description }}</div>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedVoters = !expandedVoters"
      >
        {{ t("voters") }} ({{ numVoters ?? "?" }})
        <LucideChevronUp
          class="expander"
          :class="{ expandedVoters }"
        />
      </div>

      <!-- Make scroll, not collapsible -->
      <Collapsible :expanded="expandedVoters">
        <Voters
          class="voters"
          :proposal="proposal"
        ></Voters>
      </Collapsible>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedCallData = !expandedCallData"
      >
        {{ t("calldata") }}
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
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1.5rem;

  background-color: var(--c-lvl0);
  border: solid 1px var(--c-lvl3);
  border-radius: var(--border-radius);

  > .technical {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

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
      overflow-wrap: anywhere;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Description
author: Author
link: Link
calldata: Calldata
voters: Voters
</i18n>
