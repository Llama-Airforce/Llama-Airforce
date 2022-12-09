<template>
  <div class="results">
    <div class="heading">{{ t("results") }}</div>

    <!-- For -->
    <div class="choice">
      <div class="label">{{ t("for") }}</div>

      <div class="amount">
        <AsyncValue
          :value="proposal.votesFor"
          :precision="0"
          :show-symbol="false"
          :show-zero="true"
          type="dollar"
        />
        <span>&nbsp;veCRV (</span>
        <AsyncValue
          :value="forPercentage"
          :precision="2"
          :show-zero="true"
          type="percentage"
        />
        <span>)</span>
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
        <AsyncValue
          :value="proposal.votesAgainst"
          :precision="0"
          :show-symbol="false"
          :show-zero="true"
          type="dollar"
        />
        <span>&nbsp;veCRV (</span>
        <AsyncValue
          :value="againstPercentage"
          :precision="2"
          :show-zero="true"
          type="percentage"
        />
        <span>)</span>
      </div>

      <div
        class="bar"
        :style="{ width: `${againstPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import AsyncValue from "@/Framework/AsyncValue.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Methods
const total = $computed(() => {
  return proposal.votesFor + proposal.votesAgainst;
});

const forPercentage = $computed((): number => {
  return (proposal.votesFor / total) * 100;
});

const againstPercentage = $computed(() => {
  return (proposal.votesAgainst / total) * 100;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > .heading {
    color: #a1a1aa;
    font-size: 1.125rem;
    margin-bottom: -0.5rem;
  }

  > .choice {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    > .label {
      display: flex;
      font-weight: bold;
    }

    > .amount {
      display: flex;
      font-size: 0.875rem;
    }

    > .bar {
      height: 0.5rem;
      background-color: $yellow;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
results: Results
for: For
against: Against
</i18n>
