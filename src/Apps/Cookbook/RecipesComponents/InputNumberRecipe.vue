<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const value = ref(0);

const inputNumber = `<
  v-model="value"
  placeholder="Number goes here"
  :min="-5"
  :max="Infinity" />`;
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
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="inputNumber"
        />
      </template>
    </Recipe>
  </div>
</template>
