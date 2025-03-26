<script setup lang="ts">
import type { Proposal } from "@HA/services/dao/schema";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

const statusLabel = computed(() => {
  switch (proposal.status) {
    case "active":
      return "Active";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    case "executable":
      return "Executable";
    case "executed":
      return "Executed";
    case "all":
      return "All";
    default:
      return "Unk. Status";
  }
});
</script>

<template>
  <KPI
    has-value
    class="status"
    tooltip-type="underline"
    label="Status"
  >
    <span
      class="status-value"
      :class="proposal.status"
    >
      {{ statusLabel }}
    </span>
  </KPI>
</template>

<style scoped>
.status {
  .status-value {
    &.active {
      color: var(--c-yellow);
    }

    &.failed,
    &.cancelled {
      color: var(--c-red);
    }

    &.executable {
      color: var(--c-green);
    }

    &.executed {
      color: var(--c-purple);
    }
  }
}
</style>
