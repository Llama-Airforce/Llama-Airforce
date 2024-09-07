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

<template>
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
          lang="html"
          :code="pagination"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>
