<template>
  <KPI
    class="status"
    tooltip-type="underline"
    :label="t('status')"
    :has-value="true"
    :tooltip="statusDetails"
  >
    <Tooltip>
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
  </KPI>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import KPI from "@/Framework/KPI.vue";
import Tooltip from "@/Framework/Tooltip.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import { $computed } from "vue/macros";
import {
  getStatus,
  hasWon,
  hasReachedQuorum,
  hasReachedSupport,
} from "@/Pages/Curve/DAO/Proposals/Util/ProposalHelper";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Refs
const statusDetails = $computed((): string => {
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

const statusLabel = $computed((): string => {
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
      color: $yellow;
    }

    &.denied {
      color: $red;
    }

    &.passed {
      color: $green;
    }

    &.executed {
      color: lighten($purple, 8%);
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
