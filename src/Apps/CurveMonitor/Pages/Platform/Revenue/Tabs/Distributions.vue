<template>
  <div class="distributions">
    <TableDistributions class=""></TableDistributions>
  </div>
</template>

<script setup lang="ts">
import TableDistributions from "@CM/Pages/Platform/Revenue/Tables/TableDistributions.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.distributions {
  display: flex;
  justify-content: center;
  margin: var(--dashboard-gap) 0;

  .datatable-distributions {
    max-width: 50%;
    justify-content: center;
  }
}
</style>
