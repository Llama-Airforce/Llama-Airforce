<script setup lang="ts">
const Swagger = defineAsyncComponent(
  () => import("@/Framework/Components/Swagger.vue")
);
</script>

<template>
  <Swagger url="https://api.hippo.army/feeds-docs/openapi.json" />
</template>
