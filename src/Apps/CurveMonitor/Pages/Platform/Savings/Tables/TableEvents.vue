<script setup lang="ts">
import { useQueryEvents } from "@CM/Services/Savings/Queries";

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);

const { isFetching: loading, data } = useQueryEvents(pageDebounced);

const { relativeTime } = useRelativeTime();
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
      :rows="data?.events ?? []"
      :columns="[
        'Type',
        { label: 'Amount', align: 'end' },
        'Owner',
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div
          class="type"
          :class="{
            green: event.type === 'deposit',
            red: event.type === 'withdraw',
          }"
        >
          {{ event.type }}
        </div>

        <div class="end">
          <AsyncValue
            :value="Number(event.assets) / 10 ** 18"
            :precision="0"
          />
        </div>

        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.owner}`"
            @click.stop
          >
            {{ event.owner }}
          </a>
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${event.txHash}`"
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
.table {
  --columns-data: 8rem 6rem 1fr 6rem;

  .type {
    text-transform: capitalize;

    &.green {
      color: var(--c-green);
    }

    &.red {
      color: var(--c-red);
    }
  }
}
</style>
