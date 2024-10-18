<script setup lang="ts">
import {
  type Proposal,
  getStatus,
  hasWon,
  hasReachedQuorum,
  hasReachedSupport,
} from "@CM/Services/Proposal";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Refs
const statusDetails = computed(() => {
  if (getStatus(proposal) === "denied") {
    if (!hasReachedQuorum(proposal)) {
      return "Quorum was not reached (yes votes need to pass this number)";
    } else if (!hasWon(proposal)) {
      return "More 'against' votes than 'for' votes";
    } else if (!hasReachedSupport(proposal)) {
      return "Quorum was reached and 'for' won, but not enough for support";
    }
  }

  return "";
});

const statusLabel = computed(() => {
  switch (getStatus(proposal)) {
    case "active":
      return "Active";
    case "denied":
      return "Denied";
    case "passed":
      return "Passed";
    case "executed":
      return "Executed";
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
    :tooltip="statusDetails"
  >
    <Tooltip v-if="statusDetails">
      <template #trigger>
        <span
          class="status-value"
          :class="getStatus(proposal)"
        >
          {{ statusLabel }}
        </span>
      </template>

      {{ statusDetails }}
    </Tooltip>

    <span
      v-else
      class="status-value"
      :class="getStatus(proposal)"
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

    &.denied {
      color: var(--c-red);
    }

    &.passed {
      color: var(--c-green);
    }

    &.executed {
      color: var(--c-purple);
    }
  }
}
</style>
