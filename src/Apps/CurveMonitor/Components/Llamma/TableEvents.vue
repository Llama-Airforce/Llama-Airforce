<template>
  <DataTable
    class="datatable-events"
    columns-header="1fr"
    columns-data="events-columns-data"
    :rows="events"
    :columns="['Type', 'Amount', '', 'Provider', 'Time']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <Pagination
        class="pagination"
        :items-count="count"
        :items-per-page="10"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="{ item: event }: { item: LlammaEvent }">
      <div>{{ type(event) }}</div>
      <div class="number">{{ amount(event) }}</div>
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

      <div class="number">
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

.datatable-events {
  container-type: inline-size;

  ::v-deep(.header .header-content) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  ::v-deep(.events-columns-data) {
    grid-template-columns:
      8rem
      1fr
      1fr
      6rem
      6rem;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Events

deposit: Deposit
withdrawal: Withdrawal
unknown: Unknown
</i18n>
