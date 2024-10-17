<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const input = ref("");

const inputAddress = `<InputAddress
  v-model="input"
></InputAddress>`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="InputAddress">
      <template #example>
        <InputAddress
          v-model="input"
          @select="input = $event.address"
        />
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="inputAddress"
        />
      </template>
    </Recipe>
  </div>
</template>
