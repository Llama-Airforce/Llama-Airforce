<template>
  <DataTable
    class="datatable-trades"
    columns-header="1fr"
    columns-data="trades-columns-data"
    :loading
    :rows="trades"
    :columns="['Bought', '', '', 'Sold', '', '', 'Market Maker', 'Time']"
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

    <template #row="{ item: trade }: { item: LlammaTrade }">
      <div class="number">{{ round(trade.amount_bought) }}</div>
      <TokenIcon
        :chain="chain"
        :address="trade.token_bought.address"
      ></TokenIcon>
      <div>
        <a
          class="font-mono"
          target="_blank"
          :href="`https://etherscan.io/address/${trade.token_bought.address}`"
        >
          {{ trade.token_bought.symbol }}
        </a>
      </div>

      <div class="number">{{ round(trade.amount_sold) }}</div>
      <TokenIcon
        :chain="chain"
        :address="trade.token_sold.address"
      ></TokenIcon>
      <div>
        <a
          class="font-mono"
          target="_blank"
          :href="`https://etherscan.io/address/${trade.token_sold.address}`"
        >
          {{ trade.token_sold.symbol }}
        </a>
      </div>

      <div>
        <a
          :href="`https://etherscan.io/address/${trade.buyer}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(trade.buyer) }}
        </a>
      </div>

      <div class="number">
        <a
          :href="`https://etherscan.io/tx/${trade.transaction_hash}`"
          target="_blank"
          @click.stop
        >
          {{ relativeTime(trade.timestamp) }}
        </a>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type Chain } from "@CM/Models/Chain";
import { type Endpoint, type LlammaTrade } from "@CM/Services/Llamma";
import { useQueryTrades } from "@CM/Services/Llamma/Queries";

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

const { isFetching: loading, data } = useQueryTrades(
  toRef(() => endpoint),
  toRef(() => llamma),
  toRef(() => chain),
  pageDebounced
);

const count = computed(() => data.value?.count ?? 0);
const trades = computed(() => data.value?.trades ?? []);

const { relativeTime } = useRelativeTime();
const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trades {
  container-type: inline-size;

  ::v-deep(.header .header-content) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  ::v-deep(.trades-columns-data) {
    display: grid;
    grid-template-columns:
      minmax(5rem, 1fr)
      26px
      minmax(5rem, 1fr)
      minmax(5rem, 1fr)
      26px
      minmax(5rem, 1fr)
      6rem
      6rem;

    // Right adjust number columns.
    div:nth-child(1),
    div:nth-child(4),
    div:nth-child(8) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Trades
</i18n>