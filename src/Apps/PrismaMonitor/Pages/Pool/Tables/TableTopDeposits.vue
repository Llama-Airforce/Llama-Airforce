<template>
  <Card :title="t('title')">
    <DataTable
      class="deposits-table"
      :loading="loading"
      :rows="rows"
      :columns="[
        'Address',
        { label: 'Amount', align: 'end' },
        { label: 'Date', align: 'end' },
        { label: 'Tx', align: 'end' },
      ]"
    >
      <template #row="props: { item: PoolStableOperation }">
        <div class="address font-mono">
          <a
            :href="`https://etherscan.io/address/${props.item.user}`"
            target="_blank"
          >
            {{ addressShort(props.item.user, 8) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            :value="props.item.amount"
            :precision="2"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          {{ new Date(props.item.timestamp * 1000).toLocaleDateString() }}
        </div>

        <div class="address end font-mono">
          <a
            :href="`https://etherscan.io/tx/${props.item.hash}`"
            target="_blank"
          >
            {{ addressShort(props.item.hash, 8) }}
          </a>
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { type PoolStableOperation, StabilityPoolService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const sbService = new StabilityPoolService(storeSettings.flavor);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-top-deposits"],
  queryFn: () =>
    sbService
      .getTopStableDeposits("ethereum", 5, "7d")
      .then((x) => x.operations),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Refs
const rows = computed((): PoolStableOperation[] =>
  chain(data.value)
    .map((x) => x)
    .value()
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.deposits-table {
  --columns-data: 1fr 1fr 1fr 1fr;
}
</style>

<i18n lang="yaml" locale="en">
title: Largest deposits past 7 days
</i18n>
