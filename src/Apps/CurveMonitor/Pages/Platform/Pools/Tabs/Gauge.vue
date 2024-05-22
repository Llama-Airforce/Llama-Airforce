<template>
  <div class="gauge">Gauge goes here</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.gauge {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
}
</style>
