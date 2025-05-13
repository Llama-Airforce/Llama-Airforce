<script setup lang="ts">
import type { Proposal } from "@HA/services/dao/schema";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

/** What's the % of the quorum % that's been reached so far? */
const reached = computed(
  () => (proposal.weightYes / proposal.quorumWeight) * 100
);
</script>

<template>
  <div class="quorum">
    <div class="heading">Quorum</div>
    <div class="amount">
      <AsyncValue
        type="dollar"
        :value="proposal.weightYes"
        :precision="0"
        :show-symbol="false"
      />
      /
      <AsyncValue
        type="dollar"
        :value="proposal.quorumWeight"
        :precision="0"
        :show-symbol="false"
      />
      RSUP
    </div>

    <div class="bar">
      <div
        class="support"
        :style="{ width: `${reached}%` }"
      ></div>

      <div
        class="quorum"
        :style="{ width: `${100 - reached}%` }"
      ></div>
    </div>

    <div class="percentages">
      <div>0%</div>
      <div>100%</div>
    </div>
  </div>
</template>

<style scoped>
.quorum {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  > .heading {
    color: #a1a1aa;
    font-size: 1.125rem;
  }

  > .label {
    display: flex;
    font-weight: bold;
  }

  > .amount {
    display: flex;
    font-size: 0.875rem;
    gap: 0.5ch;
  }

  > .bar {
    display: flex;
    height: 0.5rem;
    border-radius: var(--border-radius);
    overflow: hidden;

    > .support {
      background-color: var(--c-green);
    }

    > .quorum {
      background-color: var(--c-red);
    }
  }

  > .percentages {
    display: flex;
    justify-content: space-between;
    font-size: 0.625rem;

    > div:first-child {
      text-align: start;
    }

    > div:last-child {
      text-align: end;
    }
  }
}
</style>
