<template>
  <div class="inputs">
    <Recipe title="InputNumber">
      <template #example>
        <InputNumber
          v-model="value"
          placeholder="Number goes here"
          :min="-5"
          :max="Infinity"
        ></InputNumber>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="inputNumber"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const value = ref(0);

const inputNumber = `<InputNumber
  v-model="value"
  placeholder="Number goes here"
  :min="-5"
  :max="Infinity"
></InputNumber>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("inputs");
</style>
