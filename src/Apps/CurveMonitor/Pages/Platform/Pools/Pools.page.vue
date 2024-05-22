<template>
  <div class="pools">something new is coming</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pools");

.pools {
  max-width: calc(1920px - 18.125rem);
}
</style>
