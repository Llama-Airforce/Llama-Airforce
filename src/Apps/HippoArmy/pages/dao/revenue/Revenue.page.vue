<script setup lang="ts">
import { useQueryDistributions } from "@HA/queries/revenue";
import TableDistributions from "./tables/TableDistributions.vue";

const page = ref(1);
const { isFetching: loading, data } = useQueryDistributions(
  computed(() => ({
    chain: "ethereum",
    page: page.value,
    per_page: 15,
  }))
);
</script>

<template>
  <div class="dashboard">
    <TableDistributions
      :distributions="data?.distributions ?? []"
      :count="data?.count ?? 0"
      :loading
      @page="page = $event"
    />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);
}
</style>
