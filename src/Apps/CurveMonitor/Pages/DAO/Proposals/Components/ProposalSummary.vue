<template>
  <div
    class="proposal-summary"
    @click="emit('toggleExpand')"
  >
    <div
      class="title"
      :class="{ 'no-title': !proposal.metadata }"
    >
      <div class="id">{{ proposal.id }}</div>
      <div class="metadata">
        {{ proposal.metadata || t("no-title") }}
      </div>
    </div>

    <div class="row">
      <Status
        class="item"
        :proposal="proposal"
      ></Status>

      <Type
        class="item"
        :proposal="proposal"
      ></Type>

      <Proposer
        class="item"
        :proposal="proposal"
      ></Proposer>

      <Date
        class="item"
        :proposal="proposal"
        type="start"
      ></Date>

      <Date
        class="item"
        :proposal="proposal"
        type="end"
      ></Date>

      <div
        class="item expander"
        :class="{ expanded }"
      >
        <i class="fas fa-chevron-up"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import Status from "@CM/Pages/DAO/Proposals/Components/Status.vue";
import Type from "@CM/Pages/DAO/Proposals/Components/Type.vue";
import Proposer from "@CM/Pages/DAO/Proposals/Components/Proposer.vue";
import Date from "@CM/Pages/DAO/Proposals/Components/Date.vue";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
  expanded: boolean;
}

const { proposal } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "toggleExpand"): void;
}>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
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
      font-weight: 400;
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

    > :deep(.item) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > .value-container {
        span,
        a {
          font-size: 1rem;
          font-weight: 100;
        }
      }

      > .labels {
        > .label {
          font-weight: 100;
        }
      }
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

<i18n lang="yaml" locale="en">
no-title: < No Title >
</i18n>
