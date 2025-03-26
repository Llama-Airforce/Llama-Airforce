<script setup lang="ts">
import { useLiquidations } from "@HA/queries/pairs";
import type { Pair } from "@HA/services/protocols/schema";
import TableLiquidations from "../tables/TableLiquidations.vue";

const { pair } = defineProps<{
  pair: Pair;
}>();

const page = ref(1);
const { isFetching: loading, data } = useLiquidations(
  computed(() => ({
    pair_id: pair.pairId,
    page: page.value,
    per_page: 15,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <TableLiquidations
      :liquidations="data?.events ?? []"
      :count="data?.count ?? 0"
      :loading
      @page="page = $event"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;
}
</style>
