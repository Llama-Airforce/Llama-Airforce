<template>
  <KPI
    class="status"
    :label="t('status')"
    :has-value="true"
  >
    <span
      class="status-value"
      :class="proposal.status"
    >
      {{ status }}
    </span>
  </KPI>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import KPI from "@/Framework/KPI.vue";
import { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import { $computed } from "vue/macros";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const status = $computed((): string => {
  switch (proposal.status) {
    case "active":
      return t("active");
    case "closed":
      return t("closed");
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
      color: rgb(126, 217, 87);
    }

    &.closed {
      color: rgb(255, 87, 87);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
status: Status
active: Active
closed: Closed
</i18n>
