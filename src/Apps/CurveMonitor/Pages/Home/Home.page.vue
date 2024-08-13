<template>
  <div class="home">
    <KPIs></KPIs>
  </div>
</template>

<script setup lang="ts">
import KPIs from "@CM/Pages/Home/Components/KPIs.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);
}
</style>
