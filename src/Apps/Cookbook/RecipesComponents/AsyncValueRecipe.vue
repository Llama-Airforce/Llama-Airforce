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

const asyncInline = `<p>This is an inline AsyncValue:
  <AsyncValue :value="50000" :inline="true" />
</p>`;

const asyncCustomPrecision = `<AsyncValue
  :value="50000"
  :precision="(x) => x > 10000 ? 0 : 2"
  type="dollar"
></AsyncValue>`;

const customPrecision = (x: number) => (x > 10000 ? 0 : 2);
</script>

<template>
  <div class="async-values">
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
          :value="50000"
          type="dollar"
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
          :value="50000"
          type="percentage"
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
          :value="0"
          :show-zero="true"
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
          :value="50000"
          :precision="5"
          type="dollar"
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
          :value="50000"
          :show-symbol="false"
          type="dollar"
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
          :value="50000"
          :show-unit="false"
          type="dollar"
        ></AsyncValue>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncUnit"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Inline">
      <template #example>
        <p>
          This is an inline AsyncValue:
          <AsyncValue
            :value="50000"
            :inline="true"
          />
        </p>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="asyncInline"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Custom Precision Function">
      <template #example>
        <AsyncValue
          :value="50000"
          :precision="customPrecision"
          type="dollar"
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("async-values");

.async-values {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
