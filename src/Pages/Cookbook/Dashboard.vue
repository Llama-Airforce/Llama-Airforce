<template>
  <div class="dashboard-root">
    <div class="dashboard">
      <div class="row">
        <div class="item">
          Dashboard.vue

          <Code
            lang="xml"
            :code="html"
          />

          <Code
            lang="typescript"
            :code="typescript"
          />

          &lt;style lang=&quot;scss&quot; scoped&gt;

          <Code
            lang="scss"
            :code="scss"
          />

          &lt;/style&gt;
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import { Code } from "@/Framework";

const html = `<template>
  <div class="dashboard-root">
    <div class="dashboard">
      Content goes here
    </div>
  </div>
</template>`;

const typescript = `<script setup lang="ts">
<\/script>`;

const scss = `@import "@/Styles/Variables.scss";

@include dashboard("dashboard-root");
`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
@import "@/Pages/Cookbook/Cookbook.scss";

@include dashboard("dashboard-root");

.dashboard-root {
  .dashboard {
    @include cookbook-item;
  }
}
</style>
