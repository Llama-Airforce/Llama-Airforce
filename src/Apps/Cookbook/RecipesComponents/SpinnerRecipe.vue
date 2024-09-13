<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const spinner = `<Spinner class="loading"></Spinner>`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Spinner">
      <template #example>
        <Spinner class="loading"></Spinner>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="spinner"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>
