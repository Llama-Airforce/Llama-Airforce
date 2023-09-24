<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
      <div class="actions">
        <div class="chart-types">
          <ButtonToggle
            value="Coll."
            :model-value="chartType === 'collateral'"
            @click="onChartType('collateral')"
          >
          </ButtonToggle>

          <ButtonToggle
            value="Debt"
            :model-value="chartType === 'debt'"
            @click="onChartType('debt')"
          >
          </ButtonToggle>
        </div>
      </div>
    </template>

    <ChartLargePositions
      :data="data"
    ></ChartLargePositions>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Card, ButtonToggle } from "@/Framework";
import PrismaService, {
  type DecimalLabelledSeries,
} from "@PM/Services/PrismaService";
import {watch} from "vue";
import {getHost} from "@/Services/Host";
import {type TroveManagerDetails} from "@PM/Services/Socket/TroveOverviewService";
import ChartLargePositions from "@PM/Pages/Vaults/Charts/ChartLargePositions.vue";

type ChartType = "collateral" | "debt";

const { t } = useI18n();
const prismaService = new PrismaService(getHost());

// Refs
const chartType = ref<ChartType>("collateral");

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();
const loading = ref(true);
const data = ref<DecimalLabelledSeries[]>([]);

const fetchData = async () => {
  loading.value = true;
  if (!vault) {
    return;
  }

  data.value = await prismaService
    .getLargeTrovePositions("ethereum", vault.address, chartType.value)
    .then((x) => x.positions);

  loading.value = false;
};

// Watches
watch(
  () => chartType.value,
  () => {
    fetchData().catch(error => {
      console.error("Error fetching data:", error);
    });
  },
  { immediate: true }
);

watch(
  () => vault,
  async (newVault, oldVault) => {
    if (newVault !== oldVault) {
      await fetchData();
    }
  },
  { immediate: true } // This ensures the watcher is triggered immediately upon being established.
);


// Events
const onChartType = async (type: ChartType) => {
  // Don't do anything if we're not changing the type.
  if (chartType.value === type) {
    return;
  }
  chartType.value = type;
  await fetchData();
};

</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  .actions {
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;

    .legend {
      grid-column: 1;
      justify-self: center;
    }

    .chart-types {
      grid-column: 2;

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
}
</style>

<i18n lang="yaml" locale="en">
title: 5 Largest Troves vs Others
</i18n>
