<template>
  <div class="tooltips">
    <Recipe title="Tooltip">
      <template #example>
        <Tooltip>
          <template #item>
            <div>Hover over me!</div>
          </template>

          <div>Tooltip content goes here</div>
        </Tooltip>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="tooltip"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const tooltip = `<Tooltip>
  <template #item>
    <div>Hover over me!</div>
  </template>

  <div>Tooltip content goes here</div>
</Tooltip>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("tooltips");
</style>
