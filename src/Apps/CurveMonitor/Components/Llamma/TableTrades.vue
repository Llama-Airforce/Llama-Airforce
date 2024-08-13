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

    <Table
      class="trades-table"
      :rows="trades"
      :columns="[
        { label: 'Bought', align: 'end' },
        '',
        '',
        { label: 'Sold', align: 'end' },
        '',
        '',
        'Market Maker',
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: trade }: { item: LlammaTrade }">
        <div class="end">{{ round(trade.amount_bought) }}</div>
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

        <div class="end">{{ round(trade.amount_sold) }}</div>
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

        <div class="end">
          <a
            :href="`https://etherscan.io/tx/${trade.transaction_hash}`"
            target="_blank"
            @click.stop
          >
            {{ relativeTime(trade.timestamp) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type Chain } from "@CM/Models/Chain";
import { type LlammaTrade } from "@CM/Services/Llamma";

const { t } = useI18n();

// Props
interface Props {
  trades: LlammaTrade[];
  count: number;
  chain: Chain | undefined;
}

const { trades, count, chain } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  page: [page: number];
}>();

// Trades
const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (newPage) => {
  emit("page", newPage);
});

const { relativeTime } = useRelativeTime();
const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trades-table {
  --columns-data: minmax(5rem, 1fr) 26px minmax(5rem, 1fr) minmax(5rem, 1fr)
    26px minmax(5rem, 1fr) 6rem 6rem;
}
</style>

<i18n lang="yaml" locale="en">
title: Trades
</i18n>
