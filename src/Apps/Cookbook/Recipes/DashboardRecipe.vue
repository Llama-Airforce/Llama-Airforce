<template>
  <div class="dashboards">
    <Recipe title="Dashboard.vue">
      <template #snippets>
        <Code
          lang="html"
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
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Recipe from "@CB/Recipe.vue";

const html = `<template>
  <div class="dashboard">
    Content goes here
  </div>
</template>`;

const typescript = `<script setup lang="ts">
<\/script>`;

const scss = `@import "@/Styles/Variables.scss";

@include dashboard("dashboard");
`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("dashboards");
</style>
