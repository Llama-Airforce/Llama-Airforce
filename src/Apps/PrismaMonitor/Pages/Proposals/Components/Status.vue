<script setup lang="ts">
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import { getStatus } from "@PM/Pages/Proposals/Util/ProposalHelper";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Refs
const statusDetails = computed((): string => {
  if (getStatus(proposal) === "denied") {
    return t("no-quorum");
  }

  return "";
});

const statusLabel = computed((): string => {
  switch (getStatus(proposal)) {
    case "active":
      return t("active");
    case "denied":
      return t("denied");
    case "passed":
      return t("passed");
    case "executed":
      return t("executed");
    default:
      return "Unk. Status";
  }
});
</script>

<template>
  <KPI
    class="status"
    tooltip-type="underline"
    :label="t('status')"
    :has-value="true"
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

<i18n lang="yaml" locale="en">
status: Status
active: Active
denied: Denied
passed: Passed
executed: Executed

no-quorum: Quorum was not reached
</i18n>
