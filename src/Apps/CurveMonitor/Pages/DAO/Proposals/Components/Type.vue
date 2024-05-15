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
import { type Proposal } from "@CM/Services/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const type = computed((): string => {
  switch (proposal.type) {
    case "ownership":
      return t("ownership");
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
ownership: Ownership
parameter: Parameter
other: Other
</i18n>
