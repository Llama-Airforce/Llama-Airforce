<script setup lang="ts">
import type { Proposal } from "@CM/Services/Proposal";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Methods
const votesSupport = computed(() => proposal.votesFor);
const votesQuorum = computed(() => proposal.quorum * proposal.totalSupply);

/** What's the % of the quorum % that's been reached so far? */
const reached = computed(() => (votesSupport.value / votesQuorum.value) * 100);
</script>

<template>
  <div class="quorum">
    <div class="heading">Quorum</div>
    <div class="amount">
      <AsyncValue
        type="dollar"
        :value="votesSupport"
        :precision="0"
        :show-symbol="false"
      />
      /
      <AsyncValue
        type="dollar"
        :value="votesQuorum"
        :precision="0"
        :show-symbol="false"
      />
      veCRV
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
      <div class="zero">0%</div>
      <div class="quorum">
        <AsyncValue
          type="percentage"
          :value="proposal.quorum * 100"
          :precision="0"
        />
      </div>
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

    > .zero {
      text-align: start;
    }

    > .quorum {
      text-align: end;
    }
  }
}
</style>
