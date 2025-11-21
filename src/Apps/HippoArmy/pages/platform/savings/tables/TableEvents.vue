<script setup lang="ts">
import { useEvents } from "@HA/queries/savings";

const emit = defineEmits<{
  page: [page: number];
}>();

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (p) => {
  emit("page", p);
});

const { isFetching: loading, data } = useEvents(
  toRef(() => ({ chain: "ethereum", page: pageDebounced.value, per_page: 10 }))
);

const { relativeTime } = useRelativeTime();

const rows = computed(() => data.value?.events ?? []);
</script>

<template>
  <Card
    title="Events"
    :loading
  >
    <template #actions>
      <Pagination
        :items-count="data?.count ?? 0"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      :loading
      :rows
      :columns="[
        'Type',
        { label: 'Amount', align: 'end' },
        'From',
        'To',
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div
          :class="{
            green: event.type === 'deposit',
            red: event.type === 'withdraw',
          }"
        >
          {{ event.type }}
        </div>
        <div class="end">
          <AsyncValue
            :value="event.shares / 1e18"
            :precision="0"
          />
        </div>
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.sender}`"
            @click.stop
          >
            {{ event.sender ? addressShort(event.sender) : "-" }}
          </a>
        </div>
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.receiver}`"
            @click.stop
          >
            {{ event.receiver ? addressShort(event.receiver) : "-" }}
          </a>
        </div>
        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${event.txHash}`"
            @click.stop
          >
            {{ relativeTime(event.timestamp.getUTCTimestamp()) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 5rem 5rem 8rem 8rem 6rem;

  .green {
    color: var(--c-green);
  }

  .red {
    color: var(--c-red);
  }
}
</style>
