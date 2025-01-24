<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import type { LlammaTrade } from "@CM/Services/llamma";

const { trades, count, chain } = defineProps<{
  trades: LlammaTrade[];
  count: number;
  chain: Chain | undefined;
}>();

const emit = defineEmits<{
  page: [page: number];
}>();

// Trades
const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (page) => {
  emit("page", page);
});

const { relativeTime } = useRelativeTime();
const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);
</script>

<template>
  <Card title="Trades">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
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
      <template #row="{ item: trade }">
        <div class="end">{{ round(trade.amountBought) }}</div>
        <TokenIcon
          :chain
          :address="trade.tokenBought.address"
        />
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${trade.tokenBought.address}`"
          >
            {{ trade.tokenBought.symbol }}
          </a>
        </div>

        <div class="end">{{ round(trade.amountSold) }}</div>
        <TokenIcon
          :chain
          :address="trade.tokenSold.address"
        />
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${trade.tokenSold.address}`"
          >
            {{ trade.tokenSold.symbol }}
          </a>
        </div>

        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${trade.buyer}`"
            @click.stop
          >
            {{ addressShort(trade.buyer) }}
          </a>
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${trade.txHash}`"
            @click.stop
          >
            {{ relativeTime(trade.timestamp) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.trades-table {
  --columns-data: minmax(5rem, 1fr) 26px minmax(5rem, 1fr) minmax(5rem, 1fr)
    26px minmax(5rem, 1fr) 6rem 6rem;
}
</style>
