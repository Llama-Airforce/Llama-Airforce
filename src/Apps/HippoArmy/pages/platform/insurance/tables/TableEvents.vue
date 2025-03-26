<script setup lang="ts">
import type { Event } from "@HA/services/insurance/schema";

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
    case "deposit":
      return "Deposit";
    case "withdraw":
      return "Withdraw";
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
        { label: 'reUSD', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div
          :class="{
            green: event.eventType === 'deposit',
            red: event.eventType === 'withdraw',
          }"
        >
          {{ type(event) }}
        </div>

        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.owner.address}`"
            @click.stop
          >
            {{ event.owner.ens || addressShort(event.owner.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.assets"
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
  --columns-data: 8rem minmax(8rem, 1fr) minmax(4rem, 8rem) 8rem;

  .green {
    color: var(--c-green);
  }

  .red {
    color: var(--c-red);
  }
}
</style>
