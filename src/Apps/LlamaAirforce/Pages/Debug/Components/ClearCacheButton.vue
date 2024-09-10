<script setup lang="ts">
const onClearCache = (): void => {
  window.localStorage.clear();
};
</script>

<template>
  <Button
    class="button"
    :primary="true"
    @click="onClearCache"
  >
    Clear Cache
  </Button>
</template>

<style scoped>
.button {
  font-size: 1rem;
}
</style>
