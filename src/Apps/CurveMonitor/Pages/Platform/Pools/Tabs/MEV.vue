<template>
  <div class="mev">MEV goes here</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.mev {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
}
</style>
