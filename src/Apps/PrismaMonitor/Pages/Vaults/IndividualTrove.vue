<template>
  <div class="trove">TODO</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trove {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
