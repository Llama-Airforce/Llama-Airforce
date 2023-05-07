<template>
  <DataTable
    class="datatable-trades"
    :class="{ compact, time }"
    columns-header="auto auto 1fr"
    columns-data="trades-columns-data"
    :rows="transactionsPage"
    :columns="columns"
  >
    <template
      v-if="header"
      #header-title
    >
      <div class="title">{{ t("title") }}</div>

      <TabView
        class="types"
        @tab="onType($event.index)"
      >
        <TabItem header="All"></TabItem>
        <TabItem header="Swaps"></TabItem>
        <TabItem header="Deposits"></TabItem>
        <TabItem header="Withdrawals"></TabItem>
      </TabView>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template
      v-if="header"
      #header-actions
    >
      <Pagination
        class="pagination"
        :items-count="transactions.length"
        :items-per-page="txsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Transaction }">
      <div
        class="type"
        :class="{
          deposit: props.item.type === 'deposit',
          withdraw: props.item.type === 'withdraw',
          swap: props.item.type === 'swap',
        }"
      >
        <i
          v-if="props.item.type === 'deposit'"
          class="fas fa-arrow-up"
        ></i>

        <i
          v-else-if="props.item.type === 'withdraw'"
          class="fas fa-arrow-down"
        ></i>

        <i
          v-else
          class="fas fa-exchange-alt"
        ></i>

        {{ t(props.item.type) }}
      </div>

      <div
        v-if="time"
        class="number"
      >
        <a
          class="vote-link"
          :href="`https://etherscan.io/block/${props.item.blockNumber}`"
          target="_blank"
        >
          {{ props.item.blockNumber }}
        </a>
      </div>

      <div @click.stop>
        <a
          class="vote-link"
          :href="`https://etherscan.io/tx/${props.item.txHash}`"
          target="_blank"
        >
          {{ addressShort(props.item.txHash) }}
        </a>
      </div>

      <div @click.stop>
        <a
          class="vote-link"
          :href="`https://etherscan.io/address/${props.item.trader}`"
          target="_blank"
        >
          {{ addressShort(props.item.trader) }}
        </a>
      </div>

      <div
        class="assets"
        :class="{
          swap: props.item.type === 'swap',
        }"
        v-html="getAssetsString(props.item)"
      ></div>

      <div :class="{ number: time }">
        <span v-if="props.item.type === 'swap'">
          ${{ round((props.item as Swap).fee).toLocaleString() }}
        </span>
      </div>

      <div
        v-if="time"
        class="number"
      >
        {{ relativeTime(props.item.timestamp) }}
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain, round } from "lodash";
import {
  DataTable,
  InputText,
  Pagination,
  TabView,
  TabItem,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import { useCurveMonitorStore } from "@CM/Store";
import {
  type Transaction,
  isDeposit,
  isSwap,
  isWithdraw,
  Swap,
  TransactionType,
} from "@CM/Pages/Pool/Models/Transaction";
import { relativeTime as relativeTimeFunc } from "@CM/Util";

const { t } = useI18n();

const txsPerPage = 10;

// Props
interface Props {
  txs?: Transaction[];
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
const store = useCurveMonitorStore();

const search = ref("");
const types = ref<TransactionType[]>(["swap", "deposit", "withdraw"]);
const page = ref(1);
const now = ref(Date.now());

const columns = computed((): string[] => {
  return time
    ? ["Type", "Block", "Tx", "Trader", "Assets", "Fees", "Time"]
    : ["Type", "Tx", "Trader", "Assets", "Fees"];
});

const transactions = computed((): Transaction[] =>
  chain(txs ? txs : store.transactions)
    .filter((tx) => types.value.includes(tx.type))
    .filter((tx) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return (
        includesTerm(tx.blockNumber.toString()) ||
        includesTerm(tx.trader) ||
        includesTerm(tx.txHash)
      );
    })
    .reverse() // Server gives us the data in order already, just reversed.
    .value()
);

const transactionsPage = computed((): Transaction[] =>
  chain(transactions.value)
    .drop((page.value - 1) * txsPerPage)
    .take(txsPerPage)
    .value()
);

// Hooks
onMounted(() => {
  setInterval(() => {
    now.value = Date.now();
  });
});

// Methods
const relativeTime = (unixtime: number): string => {
  return relativeTimeFunc(now, unixtime);
};

const getAssetsString = (tx: Transaction): string => {
  if (isSwap(tx)) {
    const amountIn = tx.amountIn.toLocaleString();
    const amountOut = tx.amountOut.toLocaleString();

    const from = `<span>${amountIn} ${tx.tokenIn}</span>`;
    const arrow = `<i class='fas fa-arrow-right'></i>`;
    const to = `<span style='justify-self: end;'>${amountOut} ${tx.tokenOut}</span>`;

    return `${from}${arrow}${to}`;
  } else if (isDeposit(tx)) {
    const amountIn = tx.amountIn.toLocaleString();

    return `${amountIn} ${tx.tokenIn}`;
  } else if (isWithdraw(tx)) {
    const amountOut = tx.amountOut.toLocaleString();

    return `${amountOut} ${tx.tokenOut}`;
  }

  return "???";
};

// Events
const onPage = (pageNew: number) => {
  page.value = pageNew;
};

const onType = (tabIndex: number) => {
  if (tabIndex === 0) {
    types.value = ["swap", "deposit", "withdraw"];
  } else if (tabIndex === 1) {
    types.value = ["swap"];
  } else if (tabIndex === 2) {
    types.value = ["deposit"];
  } else if (tabIndex === 3) {
    types.value = ["withdraw"];
  } else {
    types.value = [];
  }
};

// Watches
watch(transactionsPage, (ps) => {
  if (ps.length === 0) {
    page.value = Math.max(1, Math.ceil(transactions.value.length / txsPerPage));
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trades {
  &.compact {
    padding: 0 0 1rem 0;
  }

  .title {
    margin-right: 1rem;
  }

  ::v-deep(.types) {
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

  .search {
    margin-right: 2rem;
    font-size: 0.875rem;
    width: auto;
  }

  .type {
    &.swap {
      color: var(--c-purple);
    }

    &.deposit {
      color: var(--c-green);
    }

    &.withdraw {
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

  ::v-deep(.trades-columns-data) {
    display: grid;
    grid-column-gap: 4rem;
    grid-template-columns:
      6rem 4rem 7rem 7rem minmax(5rem, 2fr)
      6rem minmax(10rem, 0.75fr);

    // Right adjust number columns.
    div:nth-child(6),
    div:nth-child(7),
    div:nth-child(8) {
      justify-content: end;
    }

    .vote-link {
      text-align: center;
    }
  }

  :not(&.time) {
    ::v-deep(.trades-columns-data) {
      display: grid;
      grid-column-gap: 4rem;
      grid-template-columns:
        6rem 7rem 7rem minmax(5rem, 1fr)
        minmax(6rem, 0.75fr);

      // Right adjust number columns.
      div:nth-child(5) {
        justify-content: start;
      }
    }
  }

  @media only screen and (max-width: 1280px) {
    ::v-deep(.header),
    ::v-deep(.header .header-title) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;

      .search {
        margin-right: 0;
      }
    }

    ::v-deep(.trades-columns-data) {
      display: grid;
      grid-column-gap: 2rem;
      grid-template-columns: 1fr auto;

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
withdraw: Withdraw
deposit: Deposit
search-placeholder: Search for...
</i18n>
