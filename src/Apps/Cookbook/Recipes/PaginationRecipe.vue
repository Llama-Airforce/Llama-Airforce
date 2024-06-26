<template>
  <div class="paginations">
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
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

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

@include dashboard("paginations");
</style>
