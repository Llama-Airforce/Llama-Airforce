<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

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
  show-zero
  :value="0"
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

const asyncCustomPrecision = `<AsyncValue
  :value="50000"
  :precision="(x) => x > 10000 ? 0 : 2"
  type="dollar"
></AsyncValue>`;

const customPrecision = (x: number) => (x > 10000 ? 0 : 2);
</script>

<template>
  <div class="dashboard">
    <Recipe title="AsyncValue">
      <template #example>
        <AsyncValue :value="50000"></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="async"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Dollar">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncDollar"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Percentage">
      <template #example>
        <AsyncValue
          type="percentage"
          :value="50000"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
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
          lang="html"
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
          lang="html"
          :code="asyncUnknown"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Zero">
      <template #example>
        <AsyncValue
          show-zero
          :value="0"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncZero"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Precision">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :precision="5"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncPrecision"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="No Symbol">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :show-symbol="false"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncSymbol"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="No Unit">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :show-unit="false"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncUnit"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Custom Precision Function">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :precision="customPrecision"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncCustomPrecision"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
