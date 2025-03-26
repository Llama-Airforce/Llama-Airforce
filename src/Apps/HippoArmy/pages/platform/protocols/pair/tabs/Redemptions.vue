<script setup lang="ts">
import { useRedemptions } from "@HA/queries/pairs";
import type { Pair } from "@HA/services/protocols/schema";
import TableRedemptions from "../tables/TableRedemptions.vue";

const { pair } = defineProps<{
  pair: Pair;
}>();

const page = ref(1);
const { isFetching: loading, data } = useRedemptions(
  computed(() => ({
    pair_id: pair.pairId,
    page: page.value,
    per_page: 15,
  }))
);
</script>

<template>
  <div class="dashboard-grid">
    <TableRedemptions
      :redemptions="data?.events ?? []"
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
