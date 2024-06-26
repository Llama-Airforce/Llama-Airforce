<template>
  <div class="button-toggles">
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
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const toggle = ref(false);

const btnToggle = `<ButtonToggle
  v-model="toggle"
  value="Value"
  icon="fas fa-plane"
></ButtonToggle>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("button-toggles");
</style>
