<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const spinner = `<Spinner loading size="medium" />`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Spinner">
      <template #example>
        <div class="spinners">
          <Spinner
            loading
            size="small"
          />
          <Spinner
            loading
            size="medium"
          />
          <Spinner
            loading
            size="large"
          />
          <Spinner
            loading
            size="huge"
          />
        </div>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="spinner"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.spinners {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
