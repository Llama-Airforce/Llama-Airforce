<script setup lang="ts">
import type { Redemption } from "@HA/services/pairs/schema";

const { redemptions, count } = defineProps<{
  redemptions: Redemption[];
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
  <Card title="Redemptions">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      :rows="redemptions"
      :columns="[
        'Caller',
        { label: 'Amount', align: 'end' },
        { label: 'Debt reduction', align: 'end' },
        { label: 'Collateral freed', align: 'end' },
        { label: 'Protocol fee', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.caller}`"
            @click.stop
          >
            {{ event.caller.ens || addressShort(event.caller.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue :value="event.amount" />
        </div>

        <div class="end">
          <AsyncValue :value="event.debtReduction" />
        </div>

        <div class="end">
          <AsyncValue :value="event.collateralFreed" />
        </div>

        <div class="end">
          <AsyncValue :value="event.protocolFee" />
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
  --columns-data: 6rem 1fr 1fr 1fr 1fr 6rem;
}
</style>
