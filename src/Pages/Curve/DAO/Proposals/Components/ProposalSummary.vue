<template>
  <div
    class="proposal"
    @click="emit('toggleExpand')"
  >
    <div class="title">{{ proposal.title }}</div>

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
import { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import Status from "@/Pages/Curve/DAO/Proposals/Components/Status.vue";
import Type from "@/Pages/Curve/DAO/Proposals/Components/Type.vue";
import Proposer from "@/Pages/Curve/DAO/Proposals/Components/Proposer.vue";
import Date from "@/Pages/Curve/DAO/Proposals/Components/Date.vue";

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

  > .title {
    margin-left: 2rem;
    margin-top: 1rem;
    font-size: 1.125rem;
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

      > .value {
        font-size: 1.125rem;
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
