<template>
  <div class="results">
    <div class="heading">{{ t("results") }}</div>

    <div
      v-for="choice in results.choices"
      :key="choice.label"
      class="choice"
    >
      <div class="label">{{ t(choice.label) }}</div>

      <div class="amount">
        {{ choice.amount }} {{ results.token }} (<AsyncValue
          :value="percentage(choice)"
          :precision="2"
          type="percentage"
        ></AsyncValue
        >)
      </div>

      <div
        class="bar"
        :style="{ width: `${percentage(choice)}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import AsyncValue from "@/Framework/AsyncValue.vue";
import type {
  Choice,
  Results,
} from "@/Pages/Curve/DAO/Proposals/Models/Results";

const { t } = useI18n();

// Props
interface Props {
  results: Results;
}

const { results } = defineProps<Props>();

// Methods
const percentage = (choice: Choice): number => {
  const total = results.choices.reduce((acc, x) => acc + x.amount, 0);

  return (choice.amount / total) * 100;
};
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
      background-color: rgb(255, 204, 0);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
results: Results
for: For
against: Against
</i18n>
