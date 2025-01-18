<script setup lang="ts">
import type { Proposal } from "@CM/Services/Proposal";
import Status from "@CM/Pages/DAO/Proposals/Components/Status.vue";
import Type from "@CM/Pages/DAO/Proposals/Components/Type.vue";
import Proposer from "@CM/Pages/DAO/Proposals/Components/Proposer.vue";
import Date from "@CM/Pages/DAO/Proposals/Components/Date.vue";

const { proposal } = defineProps<{
  proposal: Proposal;
  expanded: boolean;
}>();

const emit = defineEmits<{
  toggleExpand: [];
}>();

const proposalLink = computed(
  () => `/dao/proposal/${proposal.type}/${proposal.id}`
);

// Methods
const proposalToClipboard = async () => {
  await navigator.clipboard.writeText(
    `${window.location.origin}/#/dao/proposal/${proposal.type}/${proposal.id}`
  );
};
</script>

<template>
  <div
    class="proposal-summary"
    @click="emit('toggleExpand')"
  >
    <div
      class="title"
      :class="{ 'no-title': !proposal.metadata }"
    >
      <router-link
        class="id"
        :to="proposalLink"
        @click="proposalToClipboard"
      >
        <LucideLink /> {{ proposal.id }}
      </router-link>

      <div class="metadata">
        {{ proposal.metadata || "< No Title >" }}
      </div>
    </div>

    <div class="row">
      <Status
        class="item"
        :proposal
      />

      <Type
        class="item"
        :proposal
      />

      <Proposer
        class="item"
        :proposal
      />

      <Date
        class="item"
        type="start"
        :proposal
      />

      <Date
        class="item"
        type="end"
        :proposal
      />

      <div
        class="item expander"
        :class="{ expanded }"
      >
        <LucideChevronUp />
      </div>
    </div>
  </div>
</template>

<style scoped>
.proposal-summary {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  padding: 0.875rem 1.125rem;

  > .title {
    display: flex;
    gap: 1rem;

    &.no-title {
      color: var(--c-lvl6);
    }

    > .metadata {
      display: flex;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      font-size: 1.125rem;
    }

    > .id {
      display: flex;
      align-items: center;
      gap: 1ch;

      color: var(--c-lvl6);

      &:hover {
        background: unset;
      }

      .lucide {
        width: 0.75rem;
      }
    }
  }

  > .row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    @media only screen and (max-width: 1280px) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    > .expander {
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expanded {
        transform: rotate(180deg);
      }
    }

    > .kpi {
      padding: 0;
      box-shadow: unset;
    }
  }
}
</style>

<style scoped>
.proposal-summary {
  &:deep(.item) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > .value-container {
      span,
      a {
        font-size: 1rem;
      }
    }
  }
}
</style>
