<template>
  <KPI
    class="status"
    tooltip-type="underline"
    :label="t('status')"
    :has-value="true"
    :tooltip="statusDetails"
  >
    <Tooltip v-if="statusDetails">
      <template #item>
        <span
          class="status-value"
          :class="getStatus(proposal)"
        >
          {{ statusLabel }}
        </span>
      </template>

      <slot name="tooltip">
        {{ statusDetails }}
      </slot>
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

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { KPI, Tooltip } from "@/Framework";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import {
  getStatus,
  hasWon,
  hasReachedQuorum,
  hasReachedSupport,
} from "@CM/Pages/DAO/Proposals/Util/ProposalHelper";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Refs
const statusDetails = computed((): string => {
  if (getStatus(proposal) === "denied") {
    if (!hasReachedQuorum(proposal)) {
      return t("no-quorum");
    } else if (!hasWon(proposal)) {
      return t("no-win");
    } else if (!hasReachedSupport(proposal)) {
      return t("no-support");
    }
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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
no-support: Quorum was reached and 'for' won, but not enough for support
no-win: More 'against' votes than 'for' votes
</i18n>
