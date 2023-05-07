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
import { Button } from "@/Framework";

const { t } = useI18n();
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
    color: var(--c-lvl6);
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
