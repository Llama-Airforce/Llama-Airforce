<script setup lang="ts">
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Methods
const votesSupport = computed((): number => {
  return proposal.weightReceived;
});

const votesQuorum = computed((): number => {
  return proposal.weightRequired;
});

/** What's the % of the quorum % that's been reached so far? */
const reached = computed((): number => {
  return (votesSupport.value / votesQuorum.value) * 100;
});
</script>

<template>
  <div class="quorum">
    <div class="heading">{{ t("quorum") }}</div>
    <div class="amount">
      <AsyncValue
        :value="votesSupport"
        :precision="0"
        :show-symbol="false"
        type="dollar"
      />
      /
      <AsyncValue
        :value="votesQuorum"
        :precision="0"
        :show-symbol="false"
        type="dollar"
      />
      vePRISMA
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
          :value="Math.min(reached, 100)"
          :precision="0"
          type="percentage"
        ></AsyncValue>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

<i18n lang="yaml" locale="en">
quorum: Quorum
</i18n>
