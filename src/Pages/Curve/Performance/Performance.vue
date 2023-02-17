<template>
  <div class="gauges">
    <div class="dashboard">
      <Card
        class="perf-params"
        :title="t('title')">
        <div class="v-container">
          <span>
            This tool allows you to query the performance of a position when providing liquidity in a Curve pool, including impermanent loss, rewards from trading fees and rewards from CRV and CVX tokens.
          </span>
          <span>
            Select the pool you want to query. Enter the date at which you entered the position and the date until which you would like to query the pool's performance. Indicate the amount of LP tokens you received when you entered the position and press "Check".
          </span>
          <span>
            The lines on the chart are plotted in absolute US dollar profit or losses relative to a HODL position. The "Curve" line includes both impermanent loss and gains accrued from trading fees. The "Rewards" line includes impermanent loss, trading fees and CRV and CVX rewards. The "XYK" line is given as a benchmark and shows how a 0 fee Uniswap V2 pool would have performed.
          </span>
          <SearchPool
            v-model="pool"
            @select="onSelect"
          ></SearchPool>

          <div class="input-params">
            <InputDate
              :label="t('start-date')"/>
            <InputDate
              :label="t('end-date')"/>
            <div class="v-container">
            <div class="label">{{ t('lp-amount') }} </div>
            <InputNumber
              v-model="amount"
              :placeholder="100"
              :min="2020"
              :max="2100"
              />
            </div>
            <div class="submit-button">
              <Button
                class="action-button request"
                :value="t('submit')"
                :primary="true"
              ></Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useI18n} from "vue-i18n";

import InputDate from "@/Pages/Curve/Performance/Components/InputDate.vue";
import { Card , Button } from "@/Framework";
import {InputNumber} from "@/Framework";
import SearchPool from "@/Pages/Curve/Pools/Components/SearchPool.vue";
import {onMounted} from "vue";
import { getPools } from "@/Pages/Curve/Pools/DataLoaders";
import {useCurvePoolsStore} from "@/Pages/Curve/Pools/Store";
import {$ref} from "vue/macros";
import {Pool} from "@/Pages/Curve/Pools/Models";
import {PoolService} from "@/Pages/Curve/Pools/Services";
import {getHost} from "@/Services/Host";
import {shorten} from "@/Util";

const poolService = new PoolService(getHost());
const { t } = useI18n();

// Refs.
const store = useCurvePoolsStore();

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

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
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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
</style>

<i18n lang="yaml" locale="en">
title: "Pool Performance Chart"
start-date: "Start date (YYYY-MM-DD):"
end-date: "End date (YYYY-MM-DD):"
lp-amount: "Amount of LP tokens: "
submit: "Check"
</i18n>
