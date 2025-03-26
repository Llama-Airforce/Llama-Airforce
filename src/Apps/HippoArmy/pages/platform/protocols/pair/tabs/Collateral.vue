<script setup lang="ts">
import { useCollateralEvents } from "@HA/queries/pairs";
import type { Pair } from "@HA/services/protocols/schema";
import TableCollateralEvents from "../tables/TableCollateralEvents.vue";

const { pair } = defineProps<{
  pair: Pair;
}>();

const page = ref(1);
const { isFetching: loading, data } = useCollateralEvents(
  computed(() => ({
    pair_id: pair.pairId,
    page: page.value,
    per_page: 15,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <TableCollateralEvents
      :events="data?.events ?? []"
      :count="data?.count ?? 0"
      :loading
      :pair
      @page="page = $event"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;
}
</style>
