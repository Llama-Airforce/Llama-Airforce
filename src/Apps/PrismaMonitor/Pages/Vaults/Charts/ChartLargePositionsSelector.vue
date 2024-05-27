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

    <ChartLargePositions :data="data"></ChartLargePositions>
  </Card>
</template>

<script setup lang="ts">
import { ManagerService, type TroveManagerDetails } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";
import ChartLargePositions from "@PM/Pages/Vaults/Charts/ChartLargePositions.vue";

type ChartType = "collateral" | "debt";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const managerService = new ManagerService(getHost(), storeSettings.flavor);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    height: 300px;
    flex-direction: column;
    justify-content: center;
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
title: 5 Largest Troves vs Others
</i18n>
