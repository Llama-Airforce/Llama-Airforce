<template>
  <div class="slider">
    <div class="dashboard">
      <Recipe title="Slider">
        <template #example>
          <div class="value">{{ value }}</div>
          <Slider
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="value"
            @update:model-value="onInput"
          ></Slider>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="slider1"
          ></Code>

          <Code
            lang="typescript"
            :code="slider2"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Slider, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const value = ref(0);

// Events
const onInput = (newVal: string) => {
  value.value = parseFloat(newVal);
};

const slider1 = `<Slider
  :min="0"
  :max="5"
  :step="0.1"
  :model-value="value"
  @update:model-value="onInput"
></Slider>`;

const slider2 = `import { ref } from "vue";
import { Slider } from "@/Framework";

const value = ref(0);

// Events
const onInput = (newVal: string) => {
  value.value = parseFloat(newVal);
};`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("slider");
</style>
