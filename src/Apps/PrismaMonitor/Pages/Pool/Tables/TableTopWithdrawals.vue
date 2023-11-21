<template>
  <DataTable
    class="datatable-withdrawals"
    columns-header="1fr"
    columns-data="withdrawals-columns-data"
    :loading="loading"
    :rows="rows"
    :columns="['Address', 'Amount', 'Date', 'Tx']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="props: { item: PoolStableOperation }">
      <div class="address">
        <a
          :href="`https://etherscan.io/address/${props.item.user}`"
          target="_blank"
        >
          {{ addressShort(props.item.user, 8) }}
        </a>
      </div>
      <div class="number">
        <AsyncValue
          :value="props.item.amount"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        {{ new Date(props.item.timestamp * 1000).toLocaleDateString() }}
      </div>
      <div class="address">
        <a
          :href="`https://etherscan.io/tx/${props.item.hash}`"
          target="_blank"
        >
          {{ addressShort(props.item.hash, 8) }}
        </a>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { AsyncValue, DataTable, usePromise } from "@/Framework";
import {
  getHost,
  type PoolStableOperation,
  StabilityPoolService,
} from "@PM/Services";

const { t } = useI18n();

const sbService = new StabilityPoolService(getHost());

// Refs
const rows = computed((): PoolStableOperation[] =>
  chain(data.value)
    .map((x) => x)
    .value()
);

// Data
const { loading, data } = usePromise(
  () =>
    sbService
      .getTopStableWithdrawals("ethereum", 5, "7d")
      .then((x) => x.operations),
  []
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-withdrawals {
  container-type: inline-size;

  ::v-deep(.withdrawals-columns-data) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Largest withdrawals past 7 days
</i18n>
