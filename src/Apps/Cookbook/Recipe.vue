<script setup lang="ts">
const { title } = defineProps<{ title: string }>();
</script>

<template>
  <Card
    class="recipe-card"
    :title
  >
    <div class="recipe-body">
      <div class="example">
        <h3 v-if="$slots['example']">Example</h3>
        <slot name="example"></slot>
      </div>

      <div class="snippets">
        <h3 v-if="$slots['snippets']">Code</h3>
        <slot name="snippets"></slot>
      </div>
    </div>
  </Card>
</template>

<style>
.recipe-card {
  > .card-container:has(.recipe-body) {
    > .card-header {
      background: var(--c-primary);
      padding: 0.5rem 1rem;
      margin: 0 !important;
    }
  }
}
</style>

<style scoped>
.recipe-card {
  .recipe-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 0.5rem;

    h3 {
      font-size: 1rem;
      margin: 0.5rem 0;
    }
  }
}
</style>
