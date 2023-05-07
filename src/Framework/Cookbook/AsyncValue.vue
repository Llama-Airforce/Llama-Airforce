<template>
  <div class="async-value">
    <div class="dashboard">
      <Recipe title="AsyncValue">
        <template #example>
          <AsyncValue :value="50000"></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="async"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Dollar">
        <template #example>
          <AsyncValue
            :value="50000"
            type="dollar"
          ></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncDollar"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Percentage">
        <template #example>
          <AsyncValue
            :value="50000"
            type="percentage"
          ></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncPercentage"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Loading">
        <template #example>
          <AsyncValue :value="null"></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncLoading"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Unknown">
        <template #example>
          <AsyncValue :value="0"></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncUnknown"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Zero">
        <template #example>
          <AsyncValue
            :value="0"
            :show-zero="true"
          ></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncZero"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Precision">
        <template #example>
          <AsyncValue
            :value="50000"
            :precision="5"
            type="dollar"
          ></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncPrecision"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="No Symbol">
        <template #example>
          <AsyncValue
            :value="50000"
            :show-symbol="false"
            type="dollar"
          ></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncSymbol"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="No Unit">
        <template #example>
          <AsyncValue
            :value="50000"
            :show-unit="false"
            type="dollar"
          ></AsyncValue>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="asyncUnit"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Code, AsyncValue } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const async = `<AsyncValue
  :value="50000">
</AsyncValue>`;

const asyncDollar = `<AsyncValue
  :value="50000"
  type="dollar"
></AsyncValue>`;

const asyncPercentage = `<AsyncValue
  :value="50000"
  type="percentage"
></AsyncValue>`;

const asyncLoading = `<AsyncValue
  :value="null">
</AsyncValue>`;

const asyncUnknown = `<AsyncValue
  :value="0">
</AsyncValue>`;

const asyncZero = ` <AsyncValue
  :value="0"
  :show-zero="true"
></AsyncValue>`;

const asyncPrecision = `<AsyncValue
  :value="50000"
  :precision="5"
  type="dollar"
></AsyncValue>`;

const asyncSymbol = `<AsyncValue
  :value="50000"
  :show-symbol="false"
  type="dollar"
></AsyncValue>`;

const asyncUnit = `<AsyncValue
  :value="50000"
  :show-unit="false"
  type="dollar"
></AsyncValue>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("async-value");

.async-value {
  .dashboard {
    row-gap: 3rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
