<script setup lang="ts">
import {
  TransactionType,
  type TransactionDetail,
} from "@CM/Services/monitor/socketMonitorCurve";

const {
  txs = null,
  header = true,
  compact = false,
  time = true,
} = defineProps<{
  txs?: TransactionDetail[];
  header?: boolean;
  compact?: boolean;
  time?: boolean;
}>();

const { relativeTime } = useRelativeTime();

const search = ref("");
const types = ref<TransactionType[]>([
  TransactionType.Swap,
  TransactionType.Deposit,
  TransactionType.Remove,
]);

const columns = computed(() =>
  time
    ? ["Type", "Block", "Tx", "Trader", "Assets", "Time"]
    : ["Type", "Tx", "Trader", "Assets"]
);

const rows = computed(() =>
  (txs ?? [])
    .filter((tx) => types.value.includes(tx.transaction_type))
    .filter((tx) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return (
        includesTerm(tx.block_number.toString()) ||
        includesTerm(tx.trader) ||
        includesTerm(tx.tx_hash)
      );
    })
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

const getAssetsString = (tx: TransactionDetail) => {
  if (tx.transaction_type === TransactionType.Swap) {
    // TODO: make generic for multiple coins.
    const coinIn = tx.coins_leaving_wallet[0];
    const coinOut = tx.coins_entering_wallet[0];
    const amountIn = round(parseFloat(coinIn.amount.toString()), 2);
    const amountOut = round(parseFloat(coinOut.amount.toString()), 2);

    const from = `<span>${amountIn} ${coinIn.name}</span>`;
    const arrow = `<span>-></span>`;
    const to = `<span style='justify-self: end;'>${amountOut} ${coinOut.name}</span>`;

    return `${from}${arrow}${to}`;
  } else if (tx.transaction_type === TransactionType.Deposit) {
    const coinIn = tx.coins_entering_wallet[0];
    const amountIn = round(parseFloat(coinIn.amount.toString()), 2);

    return `${amountIn} ${coinIn.name}`;
  } else {
    const coinOut = tx.coins_leaving_wallet[0];
    const amountOut = round(parseFloat(coinOut.amount.toString()), 2);

    return `${amountOut} ${coinOut.name}`;
  }
};

// Events
const onType = (tabIndex: number) => {
  if (tabIndex === 0) {
    types.value = [
      TransactionType.Swap,
      TransactionType.Deposit,
      TransactionType.Remove,
    ];
  } else if (tabIndex === 1) {
    types.value = [TransactionType.Swap];
  } else if (tabIndex === 2) {
    types.value = [TransactionType.Deposit];
  } else if (tabIndex === 3) {
    types.value = [TransactionType.Remove];
  } else {
    types.value = [];
  }
};
</script>

<template>
  <Card
    class="trades-card"
    title="Transactions"
  >
    <template
      v-if="header"
      #actions
    >
      <div style="display: grid; grid-template-columns: auto auto">
        <TabView
          class="types"
          @tab="onType($event.index)"
        >
          <TabItem header="All" />
          <TabItem header="Swaps" />
          <TabItem header="Deposits" />
          <TabItem header="Removals" />
        </TabView>
      </div>

      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          search
          placeholder="Search for..."
        />

        <Pagination
          class="pagination"
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        />
      </div>
    </template>

    <Table
      class="trades-table"
      :class="{ compact, time }"
      :rows="rowsPage"
      :columns
    >
      <template #row="{ item }">
        <div
          class="type"
          :class="{
            deposit: item.transaction_type === 'deposit',
            remove: item.transaction_type === 'remove',
            swap: item.transaction_type === 'swap',
          }"
        >
          <LucideArrowUp v-if="item.transaction_type === 'deposit'" />
          <LucideArrowDown v-else-if="item.transaction_type === 'remove'" />
          <LucideArrowRightLeft v-else />

          {{ capitalize(item.transaction_type) }}
        </div>

        <div
          v-if="time"
          class="end"
        >
          <a
            class="vote-link"
            target="_blank"
            :href="`https://etherscan.io/block/${item.block_number}`"
          >
            {{ item.block_number }}
          </a>
        </div>

        <div>
          <a
            class="vote-link"
            target="_blank"
            :href="`https://etherscan.io/tx/${item.tx_hash}`"
            @click.stop
          >
            {{ addressShort(item.tx_hash) }}
          </a>
        </div>

        <div>
          <a
            class="vote-link"
            target="_blank"
            :href="`https://etherscan.io/address/${item.trader}`"
            @click.stop
          >
            {{ addressShort(item.trader) }}
          </a>
        </div>

        <div
          class="assets"
          :class="{
            swap: item.transaction_type === 'swap',
          }"
          v-html="getAssetsString(item)"
        ></div>

        <div
          v-if="time"
          class="end"
        >
          {{ relativeTime(item.block_unixtime) }}
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.trades-card {
  --header-column-actions: 2fr;

  .types {
    --border-bottom: transparant;
  }
}

.trades-table {
  --columns-gap: 4rem;
  --columns-data: 6rem 4rem 7rem 7rem minmax(5rem, 2fr) 6rem
    minmax(10rem, 0.75fr);

  --container-background-hint: hls(
    from var(--container-background) h s calc(l + 2)
  );
  --row-background: var(--container-background-hint);

  .type {
    &.swap {
      color: var(--c-purple);
    }

    &.deposit {
      color: var(--c-green);
    }

    &.remove {
      color: var(--c-red);
    }
  }

  .assets {
    display: flex;
    align-items: center;
    gap: 1rem;

    &.swap {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
    }
  }

  .vote-link {
    text-align: center;
  }

  :not(&.time) {
    --columns-gap: 4rem;
    --columns-data: 6rem 7rem 7rem minmax(5rem, 1fr) minmax(6rem, 0.75fr);
  }
}
</style>
