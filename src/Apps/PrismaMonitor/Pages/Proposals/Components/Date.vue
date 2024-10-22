<script setup lang="ts">
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { t } = useI18n();

let deadlineTimer: ReturnType<typeof setTimeout> | undefined;

const { proposal, type } = defineProps<{
  proposal: Proposal;
  type: "start" | "end";
}>();

// Refs
const deadlineString = ref("");

const label = computed((): string => {
  switch (type) {
    case "start":
      return t("start");
    case "end":
      return t("end");
    default:
      return "Unk. Type";
  }
});

const date = computed((): string => {
  switch (type) {
    case "start":
      return new Date(proposal.start * 1000).toLocaleDateString();
    case "end": {
      const endDate = new Date(proposal.end * 1000);
      return endDate > new Date()
        ? deadlineString.value
        : endDate.toLocaleDateString();
    }
    default:
      return new Date(0).toLocaleDateString();
  }
});

const dateWithTime = computed((): string => {
  switch (type) {
    case "start":
      return (
        new Date(proposal.start * 1000).toLocaleDateString() +
        " " +
        new Date(proposal.start * 1000).toTimeString()
      );
    case "end":
      return (
        new Date(proposal.end * 1000).toLocaleDateString() +
        " " +
        new Date(proposal.end * 1000).toTimeString()
      );
    default:
      return new Date(0).toLocaleDateString();
  }
});

// Hooks
onMounted(() => {
  createTimer();
});

// Methods
const createTimer = (): void => {
  const nextDate = new Date(proposal.end * 1000);

  if (deadlineTimer) {
    clearInterval(deadlineTimer);
  }

  deadlineTimer = setInterval(() => {
    deadlineString.value = countdown(nextDate);
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

<i18n lang="yaml" locale="en">
start: Start
end: End
</i18n>
