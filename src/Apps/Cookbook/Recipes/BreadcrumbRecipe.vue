<template>
  <div class="breadcrumb">
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
            lang="xml"
            :code="breadcrumb1"
          ></Code>

          <Code
            lang="typescript"
            :code="breadcrumb2"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Crumb } from "@/Framework/Crumb";
import Recipe from "@CB/Recipe.vue";

const crumbs: Crumb[] = [
  { id: "home", label: "Home" },
  { id: "crvusd", label: "crvUSD" },
  { id: "market", label: "Market" },
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

const breadcrumb2 = `const crumbs: Crumb[] = [
  { id: "home", label: "Home" },
  { id: "crvusd", label: "crvUSD" },
  { id: "market", label: "Market" },
];

const crumbActive = ref({ id: "market", label: "Market" });

const onCrumb = (crumb: Crumb) => {
  crumbActive.value = crumb;
};`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("breadcrumb");

.breadcrumb {
  .dashboard {
    row-gap: 3rem;
    column-gap: var(--dashboard-gap, 1.5rem);
    grid-template-columns: 1fr 1fr;
  }
}
</style>
