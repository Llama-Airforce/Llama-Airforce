<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <div class="chart-input">
          <InputNumber
            v-model="timestampCutoff"
            placeholder="Timestamp cut-off"
            :min="0"
            :max="new Date().getTime() / 1000"
          ></InputNumber>
        </div>

        <div class="chart-toggles">
          <Tooltip>
            <template #item>
              <ButtonToggle v-model="includeUnlockPenalty">
                <i class="fas fa-burn"></i>
              </ButtonToggle>
            </template>

            {{ t("include-unlock-penalty") }}
          </Tooltip>
        </div>

        <div class="chart-types">
          <ButtonToggle
            value="Line"
            :model-value="chartType === 'line'"
            @click="onChartType('line')"
          >
          </ButtonToggle>

          <ButtonToggle
            value="Breakdown"
            :model-value="chartType === 'breakdown'"
            @click="onChartType('breakdown')"
          >
          </ButtonToggle>
        </div>
      </div>
    </template>

    <ChartRevenueLine
      v-if="chartType === 'line'"
      :data="dataFiltered"
    ></ChartRevenueLine>

    <ChartRevenueBreakdown
      v-else
      :data="dataFiltered"
    ></ChartRevenueBreakdown>
  </Card>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import ChartRevenueLine from "@PM/Pages/Revenue/Charts/ChartRevenueLine.vue";
import ChartRevenueBreakdown from "@PM/Pages/Revenue/Charts/ChartRevenueBreakdown.vue";
import { RevenueService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

type ChartType = "line" | "breakdown";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const revenueService = new RevenueService(storeSettings.flavor);

// Refs
const chartType = ref<ChartType>("line");
const timestampCutoff = ref(1699723102);
const includeUnlockPenalty = ref(true);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-revenue-snapshots"],
  queryFn: () => revenueService.getSnapshots().then((x) => x.snapshots),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const dataFiltered = computed(() =>
  data.value
    .filter((x) => x.timestamp > timestampCutoff.value)
    .map((x) => cloneDeep(x))
    .map((x) => {
      if (!includeUnlockPenalty.value) {
        x.unlock_penalty_revenue_usd = 0;
      }

      return x;
    })
);

// Events
const onChartType = (type: ChartType) => {
  // Don't do anything if we're not changing the type.
  if (chartType.value === type) {
    return;
  }

  chartType.value = type;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }

  .actions {
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr 10rem auto auto;
    gap: 1rem;

    .legend {
      grid-column: 1;
      justify-self: center;
    }

    .chart-input {
      grid-column: 2;

      display: flex;

      input {
        flex-grow: 1;
      }
    }

    .chart-toggles {
      grid-column: 3;
    }

    .chart-types {
      grid-column: 4;

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
title: PRISMA revenue
include-unlock-penalty: Include unlock penalty revenue
</i18n>
