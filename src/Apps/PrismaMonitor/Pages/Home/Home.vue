<template>
  <div class="home">
    <TableTroveManagers></TableTroveManagers>
  </div>
</template>

<script setup lang="ts">
import TableTroveManagers from "@PM/Pages/Home/Tables/TableTroveManagers.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);
}
</style>
