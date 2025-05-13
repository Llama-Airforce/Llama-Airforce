<script setup lang="ts">
const Swagger = defineAsyncComponent(
  () => import("@/Framework/Components/Swagger.vue")
);
</script>

<template>
  <Swagger url="https://prices.curve.finance/feeds-docs/openapi.json" />
</template>
