<template>
  <div class="results">
    <div class="heading">{{ t("results") }}</div>

    <!-- For -->
    <div class="choice">
      <div class="label">{{ t("for") }}</div>

      <div class="amount">
        <div class="left">
          <AsyncValue
            :value="proposal.votesFor"
            :precision="0"
            :show-symbol="false"
            :show-zero="true"
            type="dollar"
          />

          <span>&nbsp;veCRV</span>
        </div>

        <div class="right">
          <span>(</span>
          <AsyncValue
            :value="forPercentage"
            :precision="2"
            :show-zero="true"
            type="percentage"
          />
          <span>)</span>
        </div>
      </div>

      <div
        class="bar"
        :style="{ width: `${forPercentage}%` }"
      ></div>
    </div>

    <!-- Against -->
    <div class="choice">
      <div class="label">{{ t("against") }}</div>

      <div class="amount">
        <div class="left">
          <AsyncValue
            :value="proposal.votesAgainst"
            :precision="0"
            :show-symbol="false"
            :show-zero="true"
            type="dollar"
          />
          <span>&nbsp;veCRV</span>
        </div>

        <div class="right">
          <span>(</span>
          <AsyncValue
            :value="againstPercentage"
            :precision="2"
            :show-zero="true"
            type="percentage"
          />
          <span>)</span>
        </div>
      </div>

      <div
        class="bar"
        :style="{ width: `${againstPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { AsyncValue } from "@/Framework";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Methods
const total = computed(() => {
  return proposal.votesFor + proposal.votesAgainst;
});

const forPercentage = computed((): number => {
  return (proposal.votesFor / total.value) * 100;
});

const againstPercentage = computed(() => {
  return (proposal.votesAgainst / total.value) * 100;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
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
    }

    > .bar {
      height: 0.5rem;
      background-color: var(--c-yellow);
      border-radius: var(--border-radius);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
results: Results
for: For
against: Against
</i18n>
