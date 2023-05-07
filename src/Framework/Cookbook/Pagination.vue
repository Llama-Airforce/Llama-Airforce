<template>
  <div class="pagination">
    <div class="dashboard">
      <Recipe title="Pagination">
        <template #example>
          <Pagination
            :items-count="96"
            :items-per-page="10"
            :page="page"
            @page="onPage"
          ></Pagination>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="pagination"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Pagination, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const page = ref(1);

const onPage = (pageNew: number): void => {
  page.value = pageNew;
};

const pagination = `<Pagination
  :items-count="96"
  :items-per-page="10"
  :page="page"
  @page="onPage"
></Pagination>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("pagination");
</style>
