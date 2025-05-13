<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";
</script>

<template>
  <div class="dashboard">
    <Recipe title="Swagger">
      <template #example>
        <Swagger url="https://prices.curve.finance/feeds-docs/openapi.json" />
      </template>
    </Recipe>
  </div>
</template>
