<script setup lang="ts">
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import Status from "@PM/Pages/Proposals/Components/Status.vue";
import Proposer from "@PM/Pages/Proposals/Components/Proposer.vue";
import Date from "@PM/Pages/Proposals/Components/Date.vue";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
  expanded: boolean;
}>();

const emit = defineEmits<{
  toggleExpand: [];
}>();
</script>

<template>
  <div
    class="proposal-summary"
    @click="emit('toggleExpand')"
  >
    <div
      class="title"
      :class="{ 'no-title': !proposal.metadata?.title }"
    >
      <div class="id">{{ proposal.id }}</div>
      <div class="metadata">
        {{ proposal.metadata?.title || t("no-title") }}
      </div>
    </div>

    <div class="row">
      <Status
        class="item"
        :proposal
      ></Status>

      <Proposer
        class="item"
        :proposal
      ></Proposer>

      <Date
        class="item"
        type="start"
        :proposal
      ></Date>

      <Date
        class="item"
        type="end"
        :proposal
      ></Date>

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

      color: var(--c-lvl6);
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
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  padding: 0.875rem 1.125rem;

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

<i18n lang="yaml" locale="en">
no-title: < No Title >
</i18n>
