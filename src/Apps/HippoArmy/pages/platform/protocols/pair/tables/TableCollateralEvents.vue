<script setup lang="ts">
import type { CollateralEvent } from "@HA/services/pairs/schema";

const { events, count } = defineProps<{
  events: CollateralEvent[];
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

const type = (x: CollateralEvent) => {
  switch (x.eventType) {
    case "add_collateral":
      return "Add collateral";
    case "borrow":
      return "Borrow";
    case "remove_collateral":
      return "Remove collateral";
    case "repay":
      return "Repay";
    case "redeem":
      return "Redeem";
    case "liquidate":
      return "Liquidate";
    case "leveraged_position":
      return "Lev. position";
    case "repay_with_collateral":
      return "Repay with col";
  }
};
</script>

<template>
  <Card title="Events">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      :rows="events"
      :columns="[
        'Type',
        { label: 'Debt Δ', align: 'end' },
        { label: 'Collateral Δ', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div>{{ type(event) }}</div>

        <div class="end">
          <AsyncValue :value="event.debtChange" />
        </div>

        <div class="end">
          <AsyncValue :value="event.collateralChange" />
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
  --columns-data: 8rem 1fr 1fr 6rem;
}
</style>
