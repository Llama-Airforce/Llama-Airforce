<template>
  <div class="not-found">
    <div class="not-found-container">
      <Card>{{ t("404") }}</Card>
      <img src="@/Assets/404.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Card } from "@/Framework";

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;

  > .not-found-container {
    display: flex;
    flex-direction: column;
    gap: 5rem;
    width: 50rem;

    img {
      width: 100%;
      max-width: 100%;
      object-fit: scale-down;

      @media only screen and (max-width: 1280px) {
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
404: Where are you going, pilot? Page not found, please return home fren.
</i18n>
