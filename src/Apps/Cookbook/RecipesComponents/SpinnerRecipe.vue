<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const spinner = `<Spinner></Spinner>`;
</script>

<template>
  <div class="spinners">
    <Recipe title="Spinner">
      <template #example>
        <Spinner></Spinner>
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("spinners");
</style>
