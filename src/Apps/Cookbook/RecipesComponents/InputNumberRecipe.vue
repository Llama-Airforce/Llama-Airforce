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

<template>
  <div class="dashboard">
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
          lang="html"
          :code="inputNumber"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>
