<script setup lang="ts"></script>

<template>
  <div class="gauge">Gauge goes here</div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.gauge {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
}
</style>
