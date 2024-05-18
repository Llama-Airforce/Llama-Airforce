<template>
  <DataTable
    class="datatable-trades"
    columns-header="1fr"
    columns-data="trades-columns-data"
    :loading
    :rows="trades"
    :columns="['Trade', 'Buyer', 'Tx', 'Block', 'Time']"
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
      <div class="trade">
        <span>{{ Math.round(trade.amount_sold) }}</span>
        <a
          class="font-mono"
          target="_blank"
          :href="`https://etherscan.io/address/${trade.token_sold.address}`"
        >
          {{ trade.token_sold.symbol }}
        </a>

        <span>to</span>

        <span>{{ Math.round(trade.amount_bought) }}</span>
        <a
          class="font-mono"
          target="_blank"
          :href="`https://etherscan.io/address/${trade.token_bought.address}`"
        >
          {{ trade.token_bought.symbol }}
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

      <div>
        <a
          :href="`https://etherscan.io/tx/${trade.transaction_hash}`"
          target="_blank"
          class="font-mono"
          @click.stop
        >
          {{ addressShort(trade.transaction_hash) }}
        </a>
      </div>

      <div class="number">
        <a
          :href="`https://etherscan.io/block/${trade.block_number}`"
          class="font-mono"
          target="_blank"
        >
          {{ trade.block_number }}
        </a>
      </div>

      <div class="number">
        {{ relativeTime(trade.timestamp) }}
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type Chain } from "@CM/Models/Chain";
import { type Market, type LlammaTrade } from "@CM/Services/LlamaLend";
import { useQueryTrades } from "@CM/Services/LlamaLend/Queries";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
  chain?: Chain;
}

const { market, chain } = defineProps<Props>();

// Trades
const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);

const { isFetching: loading, data } = useQueryTrades(
  toRef(() => market),
  toRef(() => chain),
  pageDebounced
);

const count = computed(() => data.value?.count ?? 0);
const trades = computed(() => data.value?.trades ?? []);

const { relativeTime } = useRelativeTime();
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
    --col-width: 10ch;

    display: grid;
    grid-template-columns:
      1fr
      10rem
      10rem
      5rem
      10rem;

    // Right adjust number columns.
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }

  .trade {
    display: flex;
    gap: 1ch;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Trades
</i18n>
