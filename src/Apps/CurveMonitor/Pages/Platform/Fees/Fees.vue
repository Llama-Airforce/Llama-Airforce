<template>
  <div class="fees">
    <TableCushions></TableCushions>
  </div>
</template>

<script setup lang="ts">
import TableCushions from "@CM/Pages/Platform/Fees/Tables/TableCushions.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("fees");

.fees {
  max-width: calc(1920px - 18.125rem);
}
</style>
