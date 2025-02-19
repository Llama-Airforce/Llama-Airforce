<script setup lang="ts">
import type { Proposal } from "@curvefi/prices-api/proposal";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <KPI
    has-value
    class="type"
    label="Type"
    :value="capitalize(proposal.type)"
  />
</template>
