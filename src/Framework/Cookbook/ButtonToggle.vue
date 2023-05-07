<template>
  <div class="button-toggle">
    <div class="dashboard">
      <Recipe title="Toggle">
        <template #example>
          <ButtonToggle
            v-model="toggle"
            value="Value"
            icon="fas fa-plane"
          ></ButtonToggle>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnToggle"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ButtonToggle, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const toggle = ref(false);

const btnToggle = `<ButtonToggle
  v-model="toggle"
  value="Value"
  icon="fas fa-plane"
></ButtonToggle>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("button-toggle");
</style>
