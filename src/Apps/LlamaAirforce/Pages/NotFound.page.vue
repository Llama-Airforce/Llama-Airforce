<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="not-found">
    {{ t("404") }}
    <img src="@/Assets/404-llama.png" />
  </div>
</template>

<style scoped>
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
  }
}
</style>

<i18n lang="yaml" locale="en">
404: Where are you going, pilot? Page not found, please return home fren.
</i18n>
