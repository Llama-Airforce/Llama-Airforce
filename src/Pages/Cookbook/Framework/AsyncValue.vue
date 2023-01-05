<template>
  <div class="async-value">
    <div class="dashboard">
      <div class="item">
        <AsyncValue :value="50000"></AsyncValue>

        <div class="info">AsyncValue</div>

        <Code
          lang="xml"
          :code="async"
        />
      </div>

      <div class="item">
        <AsyncValue
          :value="50000"
          type="dollar"
        ></AsyncValue>

        <div class="info">Dollar</div>

        <Code
          lang="xml"
          :code="asyncDollar"
        />
      </div>

      <div class="item">
        <AsyncValue
          :value="50000"
          type="percentage"
        ></AsyncValue>

        <div class="info">Percentage</div>

        <Code
          lang="xml"
          :code="asyncPercentage"
        />
      </div>

      <div class="item">
        <AsyncValue :value="null"></AsyncValue>

        <div class="info">Loading</div>

        <Code
          lang="xml"
          :code="asyncLoading"
        />
      </div>

      <div class="item">
        <AsyncValue :value="0"></AsyncValue>

        <div class="info">Unknown</div>

        <Code
          lang="xml"
          :code="asyncUnknown"
        />
      </div>

      <div class="item">
        <AsyncValue
          :value="0"
          :show-zero="true"
        ></AsyncValue>

        <div class="info">Zero</div>

        <Code
          lang="xml"
          :code="asyncZero"
        />
      </div>

      <div class="item">
        <AsyncValue
          :value="50000"
          :precision="5"
          type="dollar"
        ></AsyncValue>

        <div class="info">Precision</div>

        <Code
          lang="xml"
          :code="asyncPrecision"
        />
      </div>

      <div class="item">
        <AsyncValue
          :value="50000"
          :show-symbol="false"
          type="dollar"
        ></AsyncValue>

        <div class="info">No Symbol</div>

        <Code
          lang="xml"
          :code="asyncSymbol"
        />
      </div>

      <div class="item">
        <AsyncValue
          :value="50000"
          :show-unit="false"
          type="dollar"
        ></AsyncValue>

        <div class="info">No Unit</div>

        <Code
          lang="xml"
          :code="asyncUnit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Code from "@/Framework/Code.vue";
import AsyncValue from "@/Framework/AsyncValue.vue";

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
@import "@/Pages/Cookbook/Cookbook.scss";

@include dashboard("async-value");

.async-value {
  .dashboard {
    row-gap: 3rem;
    grid-template-columns: 1fr 1fr 1fr;

    @include cookbook-item;
  }
}
</style>
