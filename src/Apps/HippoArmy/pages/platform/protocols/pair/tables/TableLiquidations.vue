<script setup lang="ts">
import type { Liquidation } from "@HA/services/pairs/schema";

const { liquidations, count } = defineProps<{
  liquidations: Liquidation[];
  count: number;
}>();

const emit = defineEmits<{
  page: [page: number];
}>();

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (page) => {
  emit("page", page);
});

const { relativeTime } = useRelativeTime();
</script>

<template>
  <Card title="Liquidations">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      :rows="liquidations"
      :columns="[
        'Borrower',
        'Liquidator',
        { label: 'Shares liquidated', align: 'end' },
        { label: 'Collat for liquidator', align: 'end' },
        { label: 'Amount to repay', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.borrower}`"
            @click.stop
          >
            {{ event.borrower.ens || addressShort(event.borrower.address) }}
          </a>
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.liquidator}`"
            @click.stop
          >
            {{ event.liquidator.ens || addressShort(event.liquidator.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.sharesLiquidated"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.collateralForLiquidator"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.amountLiquidatorToRepay"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${event.txHash}`"
            @click.stop
          >
            {{ relativeTime(event.blockTime.getUTCTimestamp()) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 6rem 6rem 1fr 1fr 1fr 6rem;
}
</style>
