<script setup lang="ts">
import type { Proposal } from "@curvefi/prices-api/proposal";

const MIN_WIDTH = 4;

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Methods
const total = computed(() => proposal.votesFor + proposal.votesAgainst);
const forPercentage = computed(() => (proposal.votesFor / total.value) * 100);
const againstPercentage = computed(
  () => (proposal.votesAgainst / total.value) * 100
);
</script>

<template>
  <div class="results">
    <div class="heading">Results</div>

    <!-- For -->
    <div class="choice">
      <div class="label">For</div>

      <div class="amount">
        <div class="left">
          <AsyncValue
            show-zero
            type="dollar"
            :value="proposal.votesFor"
            :precision="0"
            :show-symbol="false"
          />

          <span>&nbsp;veCRV</span>
        </div>

        <div class="right">
          <span>(</span>
          <AsyncValue
            show-zero
            type="percentage"
            :value="forPercentage"
            :precision="2"
          />
          <span>)</span>
        </div>
      </div>

      <div
        class="bar"
        :style="{ width: `${Math.max(MIN_WIDTH, forPercentage)}%` }"
      ></div>
    </div>

    <!-- Against -->
    <div class="choice">
      <div class="label">Against</div>

      <div class="amount">
        <div class="left">
          <AsyncValue
            show-zero
            type="dollar"
            :value="proposal.votesAgainst"
            :precision="0"
            :show-symbol="false"
          />
          <span>&nbsp;veCRV</span>
        </div>

        <div class="right">
          <span>(</span>
          <AsyncValue
            show-zero
            type="percentage"
            :value="againstPercentage"
            :precision="2"
          />
          <span>)</span>
        </div>
      </div>

      <div
        class="bar"
        :style="{ width: `${Math.max(MIN_WIDTH, againstPercentage)}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > .heading {
    color: var(--c-lvl6);
    font-size: 1.125rem;
    margin-bottom: -0.75rem;
  }

  > .choice {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    > .label {
      display: flex;
      font-weight: bold;
    }

    > .amount {
      display: flex;
      justify-content: space-between;

      font-size: 0.875rem;

      > .left,
      > .right {
        display: flex;
      }
    }

    > .bar {
      height: 0.5rem;
      background-color: var(--c-yellow);
      border-radius: var(--border-radius);
    }
  }
}
</style>
