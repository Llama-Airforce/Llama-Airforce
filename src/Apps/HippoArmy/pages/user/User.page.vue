<script setup lang="ts">
import { useParams } from "./composables/useParams";
import Overview from "./Overview.vue";
import TablePairs from "./tables/TablePairs.vue";

const { pairId } = useParams();
</script>

<template>
  <div class="dashboard">
    <TablePairs />
    <Overview v-if="typeof pairId === 'number' && !isNaN(pairId)" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;
}
</style>
