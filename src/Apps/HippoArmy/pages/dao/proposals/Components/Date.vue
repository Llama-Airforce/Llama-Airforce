<script setup lang="ts">
import type { Proposal } from "@HA/services/dao/schema";

let deadlineTimer: ReturnType<typeof setTimeout> | undefined;

const { proposal, type } = defineProps<{
  proposal: Proposal;
  type: "start" | "end";
}>();

const deadlineString = ref("");

const label = computed(() => {
  switch (type) {
    case "start":
      return "Start";
    case "end":
      return "End";
    default:
      return "Unk. Type";
  }
});

const date = computed(() => {
  switch (type) {
    case "start":
      return proposal.createdAt.toLocaleDateString();
    case "end": {
      return proposal.end > new Date()
        ? deadlineString.value
        : proposal.end.toLocaleDateString();
    }
    default:
      return new Date(0).toLocaleDateString();
  }
});

const dateWithTime = computed(() => {
  switch (type) {
    case "start":
      return `
        ${proposal.createdAt.toLocaleDateString()} ${proposal.createdAt.toTimeString()}
      `;
    case "end":
      return `
        ${proposal.end.toLocaleDateString()} ${proposal.end.toTimeString()}
      `;
    default:
      return new Date(0).toLocaleDateString();
  }
});

// Hooks
onMounted(() => {
  createTimer();
});

// Methods
const createTimer = () => {
  if (deadlineTimer) {
    clearInterval(deadlineTimer);
  }

  deadlineTimer = setInterval(() => {
    deadlineString.value = countdown(proposal.end);
  });
};
</script>

<template>
  <KPI
    has-value
    class="date"
    tooltip-type="underline"
    :label
    :value="date"
    :tooltip="dateWithTime"
  />
</template>
