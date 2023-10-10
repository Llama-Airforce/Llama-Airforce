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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Card, ButtonToggle, useData } from "@/Framework";
import PrismaService from "@PM/Services/PrismaService";
import { watch } from "vue";
import { getHost } from "@/Services/Host";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import ChartDistribution from "@PM/Pages/Vaults/Charts/ChartDistribution.vue";

type ChartType = "collateral" | "debt";

const { t } = useI18n();
const prismaService = new PrismaService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { loading, data, loadData } = useData(() => {
  if (vault) {
    return prismaService
      .getTroveDistribution("ethereum", vault.address, chartType.value)
      .then((x) => x.distribution);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
const chartType = ref<ChartType>("collateral");

// Watches
watch(chartType, loadData, { immediate: true });
watch(
  () => vault,
  async (newVault, oldVault) => {
    if (newVault !== oldVault) {
      await loadData();
    }
  },
  { immediate: true }
);
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
