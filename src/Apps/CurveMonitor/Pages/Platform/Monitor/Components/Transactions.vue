<template>
  <Card
    class="trades-card"
    :title="t('title')"
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
          <TabItem header="All"></TabItem>
          <TabItem header="Swaps"></TabItem>
          <TabItem header="Deposits"></TabItem>
          <TabItem header="Removals"></TabItem>
        </TabView>
      </div>

      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          class="search"
          :search="true"
          :placeholder="t('search-placeholder')"
        >
        </InputText>

        <Pagination
          class="pagination"
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <DataTable
      class="trades-table"
      :class="{ compact, time }"
      :rows="rowsPage"
      :columns
    >
      <template #row="props: { item: TransactionDetail }">
        <div
          class="type"
          :class="{
            deposit: props.item.transaction_type === 'deposit',
            remove: props.item.transaction_type === 'remove',
            swap: props.item.transaction_type === 'swap',
          }"
        >
          <i
            v-if="props.item.transaction_type === 'deposit'"
            class="fas fa-arrow-up"
          ></i>

          <i
            v-else-if="props.item.transaction_type === 'remove'"
            class="fas fa-arrow-down"
          ></i>

          <i
            v-else
            class="fas fa-exchange-alt"
          ></i>

          {{ t(props.item.transaction_type) }}
        </div>

        <div
          v-if="time"
          class="end"
        >
          <a
            class="vote-link"
            :href="`https://etherscan.io/block/${props.item.block_number}`"
            target="_blank"
          >
            {{ props.item.block_number }}
          </a>
        </div>

        <div>
          <a
            class="vote-link"
            :href="`https://etherscan.io/tx/${props.item.tx_hash}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.tx_hash) }}
          </a>
        </div>

        <div>
          <a
            class="vote-link"
            :href="`https://etherscan.io/address/${props.item.trader}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.trader) }}
          </a>
        </div>

        <div
          class="assets"
          :class="{
            swap: props.item.transaction_type === 'swap',
          }"
          v-html="getAssetsString(props.item)"
        ></div>

        <div
          v-if="time"
          class="end"
        >
          {{ relativeTime(props.item.block_unixtime) }}
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import {
  TransactionType,
  type TransactionDetail,
} from "@CM/Services/Monitor/SocketMonitorCurve";

const { t } = useI18n();

type Row = TransactionDetail;

// Props
interface Props {
  txs?: TransactionDetail[];
  header?: boolean;
  compact?: boolean;
  time?: boolean;
}

const {
  txs = null,
  header = true,
  compact = false,
  time = true,
} = defineProps<Props>();

// Refs
const { relativeTime } = useRelativeTime();

const search = ref("");
const types = ref<TransactionType[]>([
  TransactionType.Swap,
  TransactionType.Deposit,
  TransactionType.Remove,
]);

const columns = computed((): string[] => {
  return time
    ? ["Type", "Block", "Tx", "Trader", "Assets", "Time"]
    : ["Type", "Tx", "Trader", "Assets"];
});

const rows = computed((): Row[] =>
  chain(txs)
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
    .value()
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

const getAssetsString = (tx: TransactionDetail): string => {
  if (tx.transaction_type === TransactionType.Swap) {
    // TODO: make generic for multiple coins.
    const coinIn = tx.coins_leaving_wallet[0];
    const coinOut = tx.coins_entering_wallet[0];
    const amountIn = roundPhil(parseFloat(coinIn.amount.toString()));
    const amountOut = roundPhil(parseFloat(coinOut.amount.toString()));

    const from = `<span>${amountIn} ${coinIn.name}</span>`;
    const arrow = `<i class='fas fa-arrow-right'></i>`;
    const to = `<span style='justify-self: end;'>${amountOut} ${coinOut.name}</span>`;

    return `${from}${arrow}${to}`;
  } else if (tx.transaction_type === TransactionType.Deposit) {
    const coinIn = tx.coins_entering_wallet[0];
    const amountIn = roundPhil(parseFloat(coinIn.amount.toString()));

    return `${amountIn} ${coinIn.name}`;
  } else if (tx.transaction_type === TransactionType.Remove) {
    const coinOut = tx.coins_leaving_wallet[0];
    const amountOut = roundPhil(parseFloat(coinOut.amount.toString()));

    return `${amountOut} ${coinOut.name}`;
  }

  return "???";
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trades-card {
  --header-columns: 1fr 2fr;

  :deep(.types) {
    margin: 0 1rem;
    font-size: 0.875rem;

    ul {
      width: auto;
      border-bottom: 0;
    }

    .tab-header {
      padding: 0.5rem 1rem;
    }
  }
}

.trades-table {
  --columns-data: 6rem 4rem 7rem 7rem minmax(5rem, 2fr) 6rem
    minmax(10rem, 0.75fr);

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

  :deep(.row-data) {
    grid-column-gap: 4rem;

    // Right adjust number columns.
    div:nth-child(6),
    div:nth-child(7),
    div:nth-child(8) {
      justify-content: end;
    }
  }

  :not(&.time) {
    --columns-data: 6rem 7rem 7rem minmax(5rem, 1fr) minmax(6rem, 0.75fr);

    :deep(.row-data) {
      grid-column-gap: 4rem;

      // Right adjust number columns.
      div:nth-child(5) {
        justify-content: start;
      }
    }
  }

  @media only screen and (max-width: 1280px) {
    --columns-data: 1fr auto;

    :deep(.header),
    :deep(.header .header-content) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;

      .search {
        margin-right: 0;
      }
    }

    :deep(.row-data) {
      grid-column-gap: 2rem;

      div:nth-child(1),
      div:nth-child(2),
      div:nth-child(3),
      div:nth-child(4),
      //div:nth-child(5),
      div:nth-child(6),
      //div:nth-child(7),
      div:nth-child(8) {
        display: none;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Transactions

swap: Swap
deposit: Deposit
remove: Remove
search-placeholder: Search for...
</i18n>
