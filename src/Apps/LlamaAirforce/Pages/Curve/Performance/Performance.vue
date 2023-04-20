<template>
  <div class="performance">
    <div
      class="dashboard"
      :class="{ loading }"
    >
      <Card :title="t('title')">
        <div class="note">
          <p>
            This tool allows you to query the performance of a position when
            providing liquidity in a Curve pool, including impermanent loss,
            rewards from trading fees and rewards from CRV and CVX tokens.
          </p>

          <p>
            Select the pool you want to query. Enter the date at which you
            entered the position and the date until which you would like to
            query the pool's performance. Indicate the amount of LP tokens you
            received when you entered the position and press "Check".
          </p>

          <p>
            The lines on the chart are plotted in absolute US dollar profit or
            losses relative to a HODL position. The "Curve Base" series includes
            both impermanent loss and gains accrued from trading fees. The "CRV
            & CVX Rewards" line includes impermanent loss, trading fees and CRV
            and CVX rewards. The "Zero Fees XYK" line is given as a benchmark
            and shows how a 0 fee Uniswap V2 pool would have performed.
          </p>
        </div>
      </Card>

      <Card>
        <div class="controls">
          <SearchPool
            v-model="pool"
            @select="onSelect"
          ></SearchPool>

          <div class="inputs">
            <InputDate
              :label="t('start-date')"
              @date-selected="updateStartDate"
            />

            <InputDate
              :label="t('end-date')"
              @date-selected="updateEndDate"
            />

            <div class="lpAmount">
              <div class="label">{{ t("lp-amount") }}</div>
              <InputNumber
                v-model="lpAmount"
                :placeholder="1000000000000000000"
                :min="2020"
                :max="2100"
              />
            </div>

            <Button
              :value="t('submit')"
              :primary="true"
              :disabled="canSubmit"
              @click="onSubmit"
            ></Button>
          </div>
        </div>
      </Card>

      <Spinner
        v-if="loading"
        class="spinner"
      ></Spinner>

      <PerformanceChart :data="perfData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Card, Button, InputNumber, Spinner } from "@/Framework";
import { shorten } from "@/Util";
import { getHost } from "@/Services/Host";
import SearchPool from "@LAF/Pages/Curve/Pools/Components/SearchPool.vue";
import { getPools } from "@LAF/Pages/Curve/Pools/DataLoaders";
import { useCurvePoolsStore } from "@LAF/Pages/Curve/Pools/Store";
import { Pool } from "@LAF/Pages/Curve/Pools/Models";
import { PoolService } from "@LAF/Pages/Curve/Pools/Services";
import InputDate from "@LAF/Pages/Curve/Performance/Components/InputDate.vue";
import PerformanceService, {
  PoolPerformanceResponse,
} from "@LAF/Pages/Curve/Performance/Services/PerformanceService";
import PerformanceChart from "@LAF/Pages/Curve/Performance/Components/PerformanceChart.vue";

const poolService = new PoolService(getHost());
const performanceService = new PerformanceService(getHost());
const { t } = useI18n();

// Refs.
const store = useCurvePoolsStore();

const pool = ref("");
const poolSelected = ref<Pool | null>(null);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const lpAmount = ref(1000000000000000000);
const perfData = ref(new PoolPerformanceResponse());
const loading = ref(false);

const canSubmit = computed((): boolean => {
  return !(
    startDate.value !== null &&
    endDate.value !== null &&
    pool.value !== "" &&
    lpAmount.value !== 0
  );
});

// Hooks
onMounted(async (): Promise<void> => {
  await getPools(store, poolService);
});

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool.value = shorten(poolNew.name);
  poolSelected.value = poolNew;
};

const onSubmit = async (): Promise<void> => {
  if (startDate.value && endDate.value && poolSelected.value) {
    loading.value = true;

    try {
      const data = await performanceService.get(
        poolSelected.value.id,
        startDate.value.getTime() / 1000,
        endDate.value.getTime() / 1000,
        lpAmount.value
      );

      if (data) {
        perfData.value = data;
      }
    } finally {
      loading.value = false;
    }
  }
};

const updateStartDate = (date: Date | null) => {
  startDate.value = date;
};

const updateEndDate = (date: Date | null) => {
  endDate.value = date;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("performance");

.dashboard {
  &.loading {
    opacity: 0.5;
  }

  .note {
    font-size: 0.875rem;
    font-weight: lighter;

    p {
      display: flex;
      margin-block-start: 0.5rem;
      margin-block-end: 0.5rem;
      line-height: 1.25rem;
    }
  }

  .controls {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 2rem;

    .inputs {
      display: flex;
      justify-content: space-between;
      gap: 2rem;

      .lpAmount {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      button {
        justify-content: center;
        align-self: center;
      }
    }
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(100%);
    z-index: 1;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: "Pool Performance Chart"
start-date: "Start date (YYYY-MM-DD):"
end-date: "End date (YYYY-MM-DD):"
lp-amount: "Amount of LP tokens (18 decimals): "
submit: "Check"
</i18n>
