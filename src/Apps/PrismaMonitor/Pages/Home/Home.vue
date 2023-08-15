<template>
  <div class="home">
    <Card>Dark Side of the Moon</Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from "@/Framework";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);
}
</style>
