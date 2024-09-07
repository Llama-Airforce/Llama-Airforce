<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const value = ref(0);

// Events
const onInput = (newVal: number) => {
  value.value = newVal;
};

const slider1 = `<Slider
  :min="0"
  :max="5"
  :step="0.2"
  :model-value="value"
  @update:model-value="onInput"
></Slider>`;

const slider2 = `const value = ref(0);

// Events
const onInput = (newVal: string) => {
  value.value = parseFloat(newVal);
};`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Slider">
      <template #example>
        <div class="value">{{ value }}</div>
        <Slider
          :min="0"
          :max="5"
          :step="0.2"
          :model-value="value"
          @update:model-value="onInput"
        ></Slider>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="slider1"
        ></Code>

        <Code
          lang="typescript"
          :code="slider2"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>
