<template>
  <div class="tooltip">
    <div class="dashboard">
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
  </div>
</template>

<script setup lang="ts">
import { Tooltip, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const tooltip = `<Tooltip>
  <template #item>
    <div>Hover over me!</div>
  </template>

  <div>Tooltip content goes here</div>
</Tooltip>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("tooltip");
</style>
