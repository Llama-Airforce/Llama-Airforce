<script setup lang="ts">
import type { ProposalVote } from "@HA/services/dao/schema";

const MIN_WIDTH = 4;

const { votes } = defineProps<{
  votes: ProposalVote[];
}>();

// Methods
const weightYes = computed(() =>
  votes.reduce((acc, x) => acc + x.weightYes, 0)
);
const weightNo = computed(() => votes.reduce((acc, x) => acc + x.weightNo, 0));
const total = computed(() => weightYes.value + weightNo.value);

const percentageYes = computed(() => (weightYes.value / total.value) * 100);
const percentageNo = computed(() => (weightNo.value / total.value) * 100);
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
            :value="weightYes"
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
            :value="percentageYes"
            :precision="2"
          />
          <span>)</span>
        </div>
      </div>

      <div
        class="bar"
        :style="{ width: `${Math.max(MIN_WIDTH, percentageYes)}%` }"
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
            :value="weightNo"
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
            :value="percentageNo"
            :precision="2"
          />
          <span>)</span>
        </div>
      </div>

      <div
        class="bar"
        :style="{ width: `${Math.max(MIN_WIDTH, percentageNo)}%` }"
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
