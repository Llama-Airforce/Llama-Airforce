<script setup lang="ts">
import type { Gauge } from "@curvefi/prices-api/gauge";
import TableVotes from "../Tables/TableVotes.vue";

const { gauge } = defineProps<{
  gauge: Gauge | undefined;
}>();

const gaugeAddress = computed(() => gauge?.address);
</script>

<template>
  <div class="dashboard-grid">
    <TableVotes
      style="grid-area: votes"
      :gauge-address
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-areas: "votes";

  @media only screen and (max-width: 1280px) {
    grid-template-areas: "votes";
  }
}
</style>
