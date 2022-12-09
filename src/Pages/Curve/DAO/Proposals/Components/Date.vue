<template>
  <KPI
    class="date"
    tooltip-type="underline"
    :label="label"
    :value="date"
    :has-value="true"
    :tooltip="dateWithTime"
  >
  </KPI>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import KPI from "@/Framework/KPI.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import { countdown } from "@/Util/DateHelper";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
  type: "start" | "end";
}

const { proposal, type } = defineProps<Props>();

// Refs
let deadlineString = $ref("");
let deadlineTimer: ReturnType<typeof setTimeout>;

const label = $computed((): string => {
  switch (type) {
    case "start":
      return t("start");
    case "end":
      return t("end");
    default:
      return "Unk. Type";
  }
});

const date = $computed((): string => {
  switch (type) {
    case "start":
      return new Date(proposal.start * 1000).toLocaleDateString();
    case "end": {
      const endDate = new Date(proposal.end * 1000);
      return endDate > new Date()
        ? deadlineString
        : endDate.toLocaleDateString();
    }
    default:
      return new Date(0).toLocaleDateString();
  }
});

const dateWithTime = $computed((): string => {
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
    deadlineString = countdown(nextDate);
  });
};
</script>

<i18n lang="yaml" locale="en">
start: Start
end: End
</i18n>
