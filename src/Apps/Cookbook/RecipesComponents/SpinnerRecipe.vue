<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const spinner = `<Spinner class="loading" />`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Spinner">
      <template #example>
        <Spinner class="loading" />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="spinner"
        />
      </template>
    </Recipe>
  </div>
</template>
