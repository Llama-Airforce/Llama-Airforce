<template>
  <Card
    :title="title"
    class="recipe-card"
  >
    <div class="recipe-body">
      <div class="example">
        <h3>Example</h3>
        <slot name="example"></slot>
      </div>

      <div class="snippets">
        <h3>Code</h3>
        <slot name="snippets"></slot>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
// Props
interface Props {
  title: string;
}

const { title } = defineProps<Props>();
</script>

<style lang="scss">
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.recipe-card {
  .recipe-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 2rem;
    margin-top: 0.5rem;

    h3 {
      font-size: 1rem;
      margin: 0.5rem 0;
    }
  }
}
</style>
