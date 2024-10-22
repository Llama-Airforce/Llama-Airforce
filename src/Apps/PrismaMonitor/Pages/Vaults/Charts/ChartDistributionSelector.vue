<script setup lang="ts">
import { ManagerService, type TroveManagerDetails } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";
import ChartDistribution from "@PM/Pages/Vaults/Charts/ChartDistribution.vue";

type ChartType = "collateral" | "debt";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const managerService = new ManagerService(storeSettings.flavor);

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();

// Refs
const chartType = ref<ChartType>("collateral");

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-trove-distributions",
    computed(() => vault?.address),
    chartType,
  ] as const,
  queryFn: ({ queryKey: [, vault, chartType] }) => {
    if (vault) {
      return managerService
        .getTroveDistribution("ethereum", vault, chartType)
        .then((x) => x.distribution);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div class="actions">
        <ButtonToggle
          :model-value="chartType === 'collateral'"
          @click="chartType = 'collateral'"
        >
          Coll.
        </ButtonToggle>

        <ButtonToggle
          :model-value="chartType === 'debt'"
          @click="chartType = 'debt'"
        >
          Debt
        </ButtonToggle>
      </div>
    </template>

    <ChartDistribution :data />
  </Card>
</template>

<style scoped>
.button-group {
  font-size: 0.875rem;
}
</style>

<i18n lang="yaml" locale="en">
title: Troves Distribution
</i18n>
