<script setup lang="ts">
import type { Event } from "@HA/services/staking/schema";

const { events, count } = defineProps<{
  events: Event[];
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

const type = (x: Event) => {
  switch (x.eventType) {
    case "stake":
      return "Stake";
    case "unstake":
      return "Unstake";
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
        'Owner',
        { label: 'RSUP', align: 'end' },
        { label: 'Dollars', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div
          :class="{
            green: event.eventType === 'stake',
            red: event.eventType === 'unstake',
          }"
        >
          {{ type(event) }}
        </div>

        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.account.address}`"
            @click.stop
          >
            {{ event.account.ens || addressShort(event.account.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.amount"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.amountUsd"
            :precision="2"
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
  --columns-data: 8rem minmax(8rem, 1fr) minmax(4rem, 8rem) minmax(4rem, 8rem)
    8rem;

  .green {
    color: var(--c-green);
  }

  .red {
    color: var(--c-red);
  }
}
</style>
