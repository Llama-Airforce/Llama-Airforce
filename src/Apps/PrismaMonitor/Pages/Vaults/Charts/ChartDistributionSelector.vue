<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <ButtonToggle
          value="Coll."
          :model-value="chartType === 'collateral'"
          @click="chartType = 'collateral'"
        >
        </ButtonToggle>

        <ButtonToggle
          value="Debt"
          :model-value="chartType === 'debt'"
          @click="chartType = 'debt'"
        >
        </ButtonToggle>
      </div>
    </template>

    <ChartDistribution :data="data"></ChartDistribution>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Card, ButtonToggle, useData } from "@/Framework";
import { getHost } from "@/Services/Host";
import ManagerService from "@PM/Services/ManagerService";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import ChartDistribution from "@PM/Pages/Vaults/Charts/ChartDistribution.vue";

type ChartType = "collateral" | "debt";

const { t } = useI18n();
const managerService = new ManagerService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { loading, data, loadData } = useData(() => {
  if (vault) {
    return managerService
      .getTroveDistribution("ethereum", vault.address, chartType.value)
      .then((x) => x.distribution);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
const chartType = ref<ChartType>("collateral");

// Watches
watch([chartType, () => vault], loadData);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    height: 300px;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  .actions {
    display: flex;
    font-size: 0.875rem;

    button {
      &:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Troves Distribution
</i18n>
