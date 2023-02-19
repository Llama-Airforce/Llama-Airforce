<template>
  <div class="gauges">
    <div
      class="dashboard"
      :class="{loading}"
    >
      <Card
        class="perf-params"
        :title="t('title')"
      >
        <div class="v-container">
          <div class="note">
            <span>
              This tool allows you to query the performance of a position when providing liquidity in a Curve pool, including impermanent loss, rewards from trading fees and rewards from CRV and CVX tokens.
            </span>
            <br />
            <span>
              Select the pool you want to query. Enter the date at which you entered the position and the date until which you would like to query the pool's performance. Indicate the amount of LP tokens you received when you entered the position and press "Check".
            </span>
            <span>
              The lines on the chart are plotted in absolute US dollar profit or losses relative to a HODL position. The "Curve Base" series includes both impermanent loss and gains accrued from trading fees. The "CRV & CVX Rewards" line includes impermanent loss, trading fees and CRV and CVX rewards. The "Zero Fees XYK" line is given as a benchmark and shows how a 0 fee Uniswap V2 pool would have performed.
            </span>
          </div>
          <SearchPool
            v-model="pool"
            @select="onSelect"
          ></SearchPool>

          <div class="input-params">
            <InputDate
              :label="t('start-date')"
              @date-selected="updateStartDate"
            />
            <InputDate
              :label="t('end-date')"
              @date-selected="updateEndDate"
            />
            <div class="v-container">
              <div class="label">{{ t('lp-amount') }}</div>
              <InputNumber
                v-model="lpAmount"
                :placeholder="1000000000000000000"
                :min="2020"
                :max="2100"
              />
            </div>
            <div class="submit-button">
              <Button
                class="action-button request"
                :value="t('submit')"
                :primary="true"
                :disabled="canSubmit"
                @click="onSubmit"
              ></Button>
            </div>
          </div>
        </div>
      </Card>
      <Spinner
        v-if="loading"
        class="spinner"
      ></Spinner>

      <PerformanceChart
        :data="perfData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import {useI18n} from "vue-i18n";

import InputDate from "@/Pages/Curve/Performance/Components/InputDate.vue";
import {Card, Button} from "@/Framework";
import {InputNumber} from "@/Framework";
import SearchPool from "@/Pages/Curve/Pools/Components/SearchPool.vue";
import {onMounted} from "vue";
import {getPools} from "@/Pages/Curve/Pools/DataLoaders";
import {useCurvePoolsStore} from "@/Pages/Curve/Pools/Store";
import {$computed, $ref} from "vue/macros";
import {Pool} from "@/Pages/Curve/Pools/Models";
import {PoolService} from "@/Pages/Curve/Pools/Services";
import {getHost} from "@/Services/Host";
import {shorten} from "@/Util";
import {Spinner} from "@/Framework";
import PerformanceService, {PoolPerformanceResponse} from "@/Pages/Curve/Performance/Services/PerformanceService";
import PerformanceChart from "@/Pages/Curve/Performance/Components/PerformanceChart.vue";

const poolService = new PoolService(getHost());
const performanceService = new PerformanceService(getHost());
const {t} = useI18n();

// Refs.
const store = useCurvePoolsStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);
let startDate: Date | null = $ref(null);
let endDate: Date | null = $ref(null);
const lpAmount: number = $ref(1000000000000000000);
let perfData: PoolPerformanceResponse = $ref(new PoolPerformanceResponse());
let loading = $ref(false);

const canSubmit = $computed((): boolean => {
  return !(startDate !== null &&
    endDate !== null &&
    pool !== '' &&
    lpAmount !== 0);
});

// Hooks
onMounted(async (): Promise<void> => {
  await getPools(store, poolService);
});

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool = shorten(poolNew.name);
  poolSelected = poolNew;
};

const onSubmit = async (): Promise<void> => {
  if (startDate && endDate && poolSelected) {
    loading = true;
    try {
      const data = await performanceService.get(poolSelected.id, startDate.getTime() / 1000, endDate.getTime() / 1000, lpAmount);
      if (data) {
        perfData = data;
      }
    } finally {
      loading = false;
    }
  }
};

const updateStartDate = (date: Date | null) => {
  startDate = date;
};

const updateEndDate = (date: Date | null) => {
  endDate = date;
};

</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.note {
  font-size: 0.75rem;
  display: grid;
  text-align: justify;
}

.dashboard {
  padding: 1.5rem;

  &.loading {
    .performance-chart {
      opacity: 0.5;
    }
    .perf-params {
      opacity: 0.5;
    }
  }
}

.v-container {
  display: grid;
  grid-gap: 1rem;
}

.input-params {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
}

.submit-button {
  margin: auto;
  display: flex;
  justify-content: right;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(100%);
  z-index: 1;
}
</style>

<i18n lang="yaml" locale="en">
title: "Pool Performance Chart"
start-date: "Start date (YYYY-MM-DD):"
end-date: "End date (YYYY-MM-DD):"
lp-amount: "Amount of LP tokens (18 decimals): "
submit: "Check"
</i18n>
