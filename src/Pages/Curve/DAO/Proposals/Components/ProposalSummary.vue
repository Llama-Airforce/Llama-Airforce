<template>
  <div
    class="proposal"
    @click="emit('toggleExpand')"
  >
    <div
      class="title"
      :class="{ 'no-title': !proposal.metadata }"
    >
      {{ proposal.metadata || t("no-title") }}
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
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import Status from "@/Pages/Curve/DAO/Proposals/Components/Status.vue";
import Type from "@/Pages/Curve/DAO/Proposals/Components/Type.vue";
import Proposer from "@/Pages/Curve/DAO/Proposals/Components/Proposer.vue";
import Date from "@/Pages/Curve/DAO/Proposals/Components/Date.vue";

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
.proposal {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 0.5rem 0;

  > .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    margin-left: 2rem;
    margin-top: 1rem;
    margin-right: 4.5rem;
    font-size: 1.125rem;
    font-weight: 400;

    &.no-title {
      color: #a1a1aa;
    }
  }

  > .row {
    display: flex;
    margin: 1rem 1rem 0rem 1rem;
    justify-content: space-between;

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
  }
}
</style>

<i18n lang="yaml" locale="en">
no-title: < No Title >
</i18n>
