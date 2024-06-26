<template>
  <div class="spinners">
    <Recipe title="Spinner">
      <template #example>
        <Spinner></Spinner>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="spinner"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const spinner = `<Spinner></Spinner>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("spinners");
</style>
