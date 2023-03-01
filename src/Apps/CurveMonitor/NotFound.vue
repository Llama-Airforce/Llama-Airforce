<template>
  <div class="not-found">
    {{ t("404") }}
    <img src="@/Assets/404.png" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

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

  img {
    width: 100%;
    max-width: 100%;
    margin: 4rem;
    object-fit: scale-down;

    @media only screen and (max-width: 1280px) {
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
404: Where are you going, pilot? Page not found, please return home fren.
</i18n>
