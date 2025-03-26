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

// Format start and end dates for the period
function formatPeriodStart(date: Date): string {
  // Create a new date to avoid modifying the original
  const dateWithOffset = new Date(date);
  // Add 4 days offset to the date
  dateWithOffset.setDate(date.getDate() + 4);

  // Calculate the start of the week (Sunday) with the offset applied
  const startOfWeek = new Date(dateWithOffset);
  startOfWeek.setDate(dateWithOffset.getDate() - dateWithOffset.getDay());

  const startMonth = startOfWeek.toLocaleString("default", { month: "short" });
  return `${startMonth} ${startOfWeek.getDate()}`;
}

function formatPeriodEnd(date: Date): string {
  // Create a new date to avoid modifying the original
  const dateWithOffset = new Date(date);
  // Add 4 days offset to the date
  dateWithOffset.setDate(date.getDate() + 4);

  // Calculate the start of the week (Sunday) with the offset applied
  const startOfWeek = new Date(dateWithOffset);
  startOfWeek.setDate(dateWithOffset.getDate() - dateWithOffset.getDay());

  // Calculate the end of the week (7 days from start minus 2 days)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4); // 6 - 2 = 4 days after start

  const endMonth = endOfWeek.toLocaleString("default", { month: "short" });
  return `${endMonth} ${endOfWeek.getDate()}`;
}
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
        'Period',
        { label: 'Amount (reUSD)', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.operator.address}`"
            @click.stop
          >
            <div class="period">
              <span>{{ formatPeriodStart(event.blockTime) }}</span>
              <LucideChevronRight class="chevron" />
              <span>{{ formatPeriodEnd(event.blockTime) }}</span>
            </div>
          </a>
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="event.amount"
            :show-symbol="false"
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
  --columns-data: 10rem minmax(4rem, 1fr) 6rem;
}

.period {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1ch;

  > span:first-child {
    justify-self: end;
  }

  > span:last-child {
    justify-self: start;
  }
}

a:hover .period,
a:active .period {
  background: var(--c-lvl6);
}
</style>
