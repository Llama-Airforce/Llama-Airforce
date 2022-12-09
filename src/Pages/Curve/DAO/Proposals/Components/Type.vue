<template>
  <KPI
    class="type"
    :label="t('type')"
    :value="type"
    :has-value="true"
  >
  </KPI>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import KPI from "@/Framework/KPI.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const type = $computed((): string => {
  switch (proposal.type) {
    case "gauge":
      return t("gauge");
    case "parameter":
      return t("parameter");
    case "other":
      return t("other");
    default:
      return "Unk. Type";
  }
});
</script>

<i18n lang="yaml" locale="en">
type: Type
gauge: Gauge
parameter: Parameter
other: Other
</i18n>
