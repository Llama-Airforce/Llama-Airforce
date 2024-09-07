<script setup lang="ts">
import { type Crumb } from "@/Framework/Crumb";
import Recipe from "@CB/Recipe.vue";

const crumbs: Crumb[] = [
  { id: "home", label: "Home" },
  { id: "crvusd", label: "crvUSD" },
  { id: "market", label: "Market" },
  { id: "hint", label: "Hint Example", hint: true },
];

const crumbActive = ref({ id: "market", label: "Market" });

const onCrumb = (crumb: Crumb) => {
  crumbActive.value = crumb;
};

const breadcrumb1 = `<Breadcrumb
  :crumbs="crumbs"
  :active="crumbActive"
  @crumb="onCrumb"
></Breadcrumb>`;

const breadcrumb2 = `import { ref } from 'vue';
import { type Crumb } from "@/Framework/Crumb";

const crumbs: Crumb[] = [
  { id: "home", label: "Home" },
  { id: "crvusd", label: "crvUSD" },
  { id: "market", label: "Market" },
  { id: "hint", label: "Hint Example", hint: true },
];

const crumbActive = ref<Crumb | undefined>({ id: "market", label: "Market" });

const onCrumb = (crumb: Crumb) => {
  crumbActive.value = crumb;
};`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Breadcrumb">
      <template #example>
        <Breadcrumb
          :crumbs="crumbs"
          :active="crumbActive"
          @crumb="onCrumb"
        ></Breadcrumb>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="breadcrumb1"
        ></Code>

        <Code
          lang="typescript"
          :code="breadcrumb2"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>
