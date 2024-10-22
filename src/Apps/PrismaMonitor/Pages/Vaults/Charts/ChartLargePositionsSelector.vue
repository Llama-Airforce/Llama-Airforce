<script setup lang="ts">
import { ManagerService, type TroveManagerDetails } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";
import ChartLargePositions from "@PM/Pages/Vaults/Charts/ChartLargePositions.vue";

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
    "prisma-large-trove-positions",
    computed(() => vault?.address),
    chartType,
  ] as const,
  queryFn: ({ queryKey: [, vault, chartType] }) => {
    if (vault) {
      return managerService
        .getLargeTrovePositions("ethereum", vault, chartType)
        .then((x) => x.positions);
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
      <div class="button-group">
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

    <ChartLargePositions :data />
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: 5 Largest Troves vs Others
</i18n>
