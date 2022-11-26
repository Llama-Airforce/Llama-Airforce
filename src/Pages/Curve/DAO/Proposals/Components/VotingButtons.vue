<template>
  <div class="buttons">
    <div class="heading">{{ t("voting") }}</div>

    <div class="buttons">
      <Button
        :value="t('view-discussion')"
        :primary="false"
        :disabled="true"
      ></Button>

      <Button
        :value="t('vote-vecrv')"
        :primary="true"
        :disabled="true"
      ></Button>

      <Button
        :value="t('vote-cvx')"
        :primary="true"
        :disabled="true"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "@/Framework/Button.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import type { Results } from "@/Pages/Curve/DAO/Proposals/Models/Results";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const results: Results = {
  token: "veCRV",
  choices: [
    { label: "Yes", amount: 453453 },
    { label: "No", amount: 151151 },
  ],
};

// Refs
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  > .heading {
    color: #a1a1aa;
    font-size: 1.125rem;
    margin-bottom: -0.5rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
voting: Voting
view-discussion: View Discussion
vote-vecrv: Vote with veCRV
vote-cvx: Vote with CVX
</i18n>
