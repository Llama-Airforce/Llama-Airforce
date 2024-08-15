<template>
  <Card
    :title="t('title')"
    :loading
  >
    <Table
      class="withdrawals-table"
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
    </Table>
  </Card>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type PoolStableOperation, StabilityPoolService } from "@PM/Services";
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.withdrawals-table {
  --columns-data: 1fr 1fr 1fr 1fr;
}
</style>

<i18n lang="yaml" locale="en">
title: Largest withdrawals past 7 days
</i18n>
