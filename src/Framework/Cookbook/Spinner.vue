<template>
  <div class="spinner">
    <div class="dashboard">
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
  </div>
</template>

<script setup lang="ts">
import { Spinner, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const spinner = `<Spinner></Spinner>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("spinner");
</style>
