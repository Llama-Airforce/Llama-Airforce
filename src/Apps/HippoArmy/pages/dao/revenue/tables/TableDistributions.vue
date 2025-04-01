<script setup lang="ts">
import type { Distribution } from "@HA/services/revenue/schema";

const { distributions, count } = defineProps<{
  distributions: Distribution[];
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
  <Card title="Distributions">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      :rows="distributions"
      :columns="[
        'Operator',
        { label: 'Amount', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.operator}`"
            @click.stop
          >
            {{ event.operator.ens || addressShort(event.operator.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            :value="event.amount"
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
  --columns-data: 6rem 1fr 6rem;
}
</style>
