<template>
  <div class="holiday">
    <Card>
      <h1>{{ t("holiday") }}</h1>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Card } from "@/Framework";

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.holiday {
  @include border(var(--c-yellow-rgb));

  h1 {
    font-size: 1rem;
  }

  ::v-deep(.card-body) {
    display: flex;
    justify-content: space-between;

    > .text {
      font-size: 0.75rem;
      font-weight: var(--font-weight);
      max-width: 25rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
holiday: Aura dashboards are on holiday and won't display data past the 27th round.
</i18n>
