<template>
  <div class="cushions">
    <TableCushions></TableCushions>
  </div>
</template>

<script setup lang="ts">
import TableCushions from "@CM/Pages/Platform/Revenue/Components/TableCushions.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.cushions {
  margin: var(--dashboard-gap) 0;
}
</style>
