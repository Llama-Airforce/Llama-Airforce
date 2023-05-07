<template>
  <div class="input-number">
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
            lang="xml"
            :code="inputNumber"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InputNumber, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

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

@include dashboard("input-number");
</style>
