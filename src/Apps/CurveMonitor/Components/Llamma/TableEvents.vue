<script setup lang="ts">
import type { LlammaEvent } from "@CM/Services/Llamma";

const { events, count } = defineProps<{
  events: LlammaEvent[];
  count: number;
}>();

const emit = defineEmits<{
  page: [page: number];
}>();

// Trades
const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (page) => {
  emit("page", page);
});

const { relativeTime } = useRelativeTime();

const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);

const amount = (x: LlammaEvent) =>
  round(x.deposit?.amount ?? x.withdrawal?.amount_collateral ?? 0);

const type = (x: LlammaEvent) =>
  x.deposit ? "Deposit" : x.withdrawal ? "Withdrawal" : "Unknown";
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
      class="events-table"
      :rows="events"
      :columns="[
        'Type',
        { label: 'Amount', align: 'end' },
        '',
        'Provider',
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div>{{ type(event) }}</div>
        <div class="end">{{ amount(event) }}</div>
        <div></div>

        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.provider}`"
            @click.stop
          >
            {{ addressShort(event.provider) }}
          </a>
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${event.transaction_hash}`"
            @click.stop
          >
            {{ relativeTime(event.timestamp) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.events-table {
  --columns-data: 8rem 1fr 1fr 6rem 6rem;
}
</style>
