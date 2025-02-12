<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const async = `<AsyncValue
  :value="50000" />`;

const asyncDollar = `<AsyncValue
  :value="50000"
  type="dollar" />`;

const asyncPercentage = `<
  :value="50000"
  type="percentage" />`;

const asyncLoading = `<
  :value="null" />`;

const asyncUnknown = `<AsyncValue
  :value="0" />`;

const asyncZero = ` <AsyncValue
  show-zero
  :value="0" />`;

const asyncPrecision = `<AsyncValue
  :value="50000"
  :precision="5"
  type="dollar" />`;

const asyncSymbol = `<
  :value="50000"
  :show-symbol="false"
  type="dollar" />`;

const asyncUnit = `<
  :value="50000"
  :show-unit="false"
  type="dollar" />`;

const asyncCustomPrecision = `<AsyncValue
  :value="50000"
  :precision="(x) => x > 10000 ? 0 : 2"
  type="dollar" />`;

const customPrecision = (x: number) => (x > 10000 ? 0 : 2);
</script>

<template>
  <div class="dashboard">
    <Recipe title="AsyncValue">
      <template #example>
        <AsyncValue :value="50000" />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="async"
        />
      </template>
    </Recipe>

    <Recipe title="Dollar">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncDollar"
        />
      </template>
    </Recipe>

    <Recipe title="Percentage">
      <template #example>
        <AsyncValue
          type="percentage"
          :value="50000"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncPercentage"
        />
      </template>
    </Recipe>

    <Recipe title="Loading">
      <template #example>
        <AsyncValue :value="null" />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncLoading"
        />
      </template>
    </Recipe>

    <Recipe title="Unknown">
      <template #example>
        <AsyncValue :value="0" />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncUnknown"
        />
      </template>
    </Recipe>

    <Recipe title="Zero">
      <template #example>
        <AsyncValue
          show-zero
          :value="0"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncZero"
        />
      </template>
    </Recipe>

    <Recipe title="Precision">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :precision="5"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncPrecision"
        />
      </template>
    </Recipe>

    <Recipe title="No Symbol">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :show-symbol="false"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncSymbol"
        />
      </template>
    </Recipe>

    <Recipe title="No Unit">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :show-unit="false"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncUnit"
        />
      </template>
    </Recipe>

    <Recipe title="Custom Precision Function">
      <template #example>
        <AsyncValue
          type="dollar"
          :value="50000"
          :precision="customPrecision"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncCustomPrecision"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
