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

const periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds (7 days * 24 hours * 60 minutes * 60 seconds * 1000 ms)

// Calculate period dates based on 7-week periods starting from March 20, 2025
function getPeriodStart(index: number): Date {
  // First period start date: March 20, 2025 (UTC)
  const firstPeriodStart = new Date(Date.UTC(2025, 2, 20)); // Month is 0-indexed (2 = March)

  // Add index * periodDuration to the first period start date
  const periodStart = new Date(
    firstPeriodStart.getTime() + index * periodDuration
  );

  return periodStart;
}

function getPeriodEnd(index: number): Date {
  // Get the start date using the existing formatPeriodStart function
  const periodStart = getPeriodStart(index);

  // Add 1 week to get the end date
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodStart.getDate() + 7); // Add 1 week (7 days)

  return periodEnd;
}

function formatDate(date: Date) {
  const endMonth = date.toLocaleString("default", { month: "short" });
  return `${endMonth} ${date.getDate()}`;
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
      <template #row="{ item: event, idx }">
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.operator.address}`"
            @click.stop
          >
            <div class="period">
              <span>
                {{ formatDate(getPeriodStart(distributions.length - idx - 1)) }}
              </span>
              <LucideChevronRight class="chevron" />
              <span>
                {{ formatDate(getPeriodEnd(distributions.length - idx - 1)) }}
              </span>
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
