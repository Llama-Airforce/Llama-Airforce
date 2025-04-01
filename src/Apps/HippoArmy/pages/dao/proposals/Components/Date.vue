<script setup lang="ts">
import type { Proposal } from "@HA/services/dao/schema";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

const dateWithTime = computed(
  () =>
    proposal.createdAt.toLocaleDateString() + proposal.createdAt.toTimeString()
);
</script>

<template>
  <KPI
    has-value
    class="date"
    tooltip-type="underline"
    label="Start"
    :value="proposal.createdAt.toLocaleDateString()"
    :tooltip="dateWithTime"
  />
</template>
