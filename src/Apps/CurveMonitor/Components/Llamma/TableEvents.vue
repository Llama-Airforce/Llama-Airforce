<template>
  <DataTable
    class="datatable-events"
    columns-header="1fr"
    columns-data="events-columns-data"
    :loading
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
import { type Chain } from "@CM/Models/Chain";
import { type Endpoint, type LlammaEvent } from "@CM/Services/Llamma";
import { useQueryEvents } from "@CM/Services/Llamma/Queries";

const { t } = useI18n();

// Props
interface Props {
  endpoint: Endpoint;
  llamma: string | undefined;
  chain: Chain | undefined;
}

const { endpoint, llamma, chain } = defineProps<Props>();

// Trades
const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);

const { isFetching: loading, data } = useQueryEvents(
  toRef(() => endpoint),
  toRef(() => llamma),
  toRef(() => chain),
  pageDebounced
);

const count = computed(() => data.value?.count ?? 0);
const events = computed(() => data.value?.trades ?? []);

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
    display: grid;
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
