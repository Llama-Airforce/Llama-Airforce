<script setup lang="ts">
import { StabilityPoolService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const sbService = new StabilityPoolService(storeSettings.flavor);

// Refs
const rows = computed(() => data.value.map((x) => x));

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-top-withdrawals"],
  queryFn: () =>
    sbService
      .getTopStableWithdrawals("ethereum", 5, "7d")
      .then((x) => x.operations),
  initialData: [],
  initialDataUpdatedAt: 0,
});
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <Table
      class="withdrawals-table"
      :rows
      :columns="[
        'Address',
        { label: 'Amount', align: 'end' },
        { label: 'Date', align: 'end' },
        { label: 'Tx', align: 'end' },
      ]"
    >
      <template #row="{ item }">
        <div class="address font-mono">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${item.user}`"
          >
            {{ addressShort(item.user, 8) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.amount"
            :precision="2"
          />
        </div>

        <div class="end">
          {{ new Date(item.timestamp * 1000).toLocaleDateString() }}
        </div>

        <div class="address end font-mono">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${item.hash}`"
          >
            {{ addressShort(item.hash, 8) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.withdrawals-table {
  --columns-data: 1fr 1fr 1fr 1fr;
}
</style>

<i18n lang="yaml" locale="en">
title: Largest withdrawals past 7 days
</i18n>
