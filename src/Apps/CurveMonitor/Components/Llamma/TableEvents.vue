<template>
  <Card :title="t('title')">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <DataTable
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
      <template #row="{ item: event }: { item: LlammaEvent }">
        <div>{{ type(event) }}</div>
        <div class="end">{{ amount(event) }}</div>
        <div></div>

        <div>
          <a
            :href="`https://etherscan.io/address/${event.provider}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(event.provider) }}
          </a>
        </div>

        <div class="end">
          <a
            :href="`https://etherscan.io/tx/${event.transaction_hash}`"
            target="_blank"
            @click.stop
          >
            {{ relativeTime(event.timestamp) }}
          </a>
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type LlammaEvent } from "@CM/Services/Llamma";

const { t } = useI18n();

// Props
interface Props {
  events: LlammaEvent[];
  count: number;
}

const { events, count } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  page: [page: number];
}>();

// Trades
const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (newPage) => emit("page", newPage));

const { relativeTime } = useRelativeTime();

const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);

const amount = (x: LlammaEvent) =>
  round(x.deposit?.amount ?? x.withdrawal?.amount_collateral ?? 0);

const type = (x: LlammaEvent) =>
  x.deposit ? t("deposit") : x.withdrawal ? t("withdrawal") : t("unknown");
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.events-table {
  --columns-data: 8rem 1fr 1fr 6rem 6rem;
}
</style>

<i18n lang="yaml" locale="en">
title: Events

deposit: Deposit
withdrawal: Withdrawal
unknown: Unknown
</i18n>
