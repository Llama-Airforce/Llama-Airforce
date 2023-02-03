<template>
  <DataTable
    class="datatable-trades"
    columns-header="auto auto 1fr"
    columns-data="trades-columns-data"
    :rows="transactionsPage"
    :columns="[
      'Type',
      'Block',
      'Tx',
      'Trader',
      'Assets',
      'Value',
      'Fees',
      'Time',
    ]"
    @selected="onSelected"
  >
    <template #header-title>
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
      >
      </InputText>
    </template>

    <template #header-actions>
      <Pagination
        class="pagination"
        :items-count="transactions.length"
        :items-per-page="10"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Transaction }">
      <div
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

      <div class="number">
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

      <div>{{ getAssetsString(props.item) }}</div>

      <div class="number">
        <AsyncValue
          :value="Math.abs(props.item.value)"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          v-if="props.item.type === 'swap'"
          :value="Math.abs((props.item as Swap).fee)"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div>
        {{ relativeTime(props.item.timestamp) }}
      </div>

      <!-- <div class="sandwiched">
        <i class="fas fa-hamburger"> </i>
      </div> -->
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  AsyncValue,
  DataTable,
  InputText,
  Pagination,
  TabView,
  TabItem,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import type { Transaction } from "@/Pages/CurveMonitor/Models";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import {
  isDeposit,
  isSwap,
  isWithdraw,
  Swap,
  TransactionType,
} from "@/Pages/CurveMonitor/Models/Transaction";

type Round = {
  round: number;
  value: number;
};

const { t } = useI18n();

// Refs
const store = useCurveMonitorStore();

const search = $ref("");
const txsPerPage = 10;
let types: TransactionType[] = $ref(["swap", "deposit", "withdraw"]);
let page = $ref(1);

let now = $ref(Date.now());

const transactions: Transaction[] = $computed(() =>
  chain(store.transactions)
    .filter((tx) => types.includes(tx.type))
    .filter((tx) => {
      const terms = search.toLocaleLowerCase().split(" ");

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

const transactionsPage = $computed(() =>
  chain(transactions)
    .drop((page - 1) * txsPerPage)
    .take(txsPerPage)
    .value()
);

// Hooks
onMounted(() => {
  setInterval(() => {
    now = Date.now();
  });
});

// Methods
const getAssetsString = (tx: Transaction): string => {
  if (isSwap(tx)) {
    return `${tx.tokenIn} -> ${tx.tokenOut}`;
  } else if (isDeposit(tx)) {
    return tx.tokenIn;
  } else if (isWithdraw(tx)) {
    return tx.tokenOut;
  }

  return "???";
};

// returns eg "2 minutes ago"
const relativeTime = (unixtime: number): string => {
  const nowUnixTime = Math.round(now / 1000);
  const secondsPast = nowUnixTime - unixtime;

  if (secondsPast < 60) {
    return `${Math.round(secondsPast)} seconds ago`;
  } else if (secondsPast < 60 * 60) {
    return `${Math.round(secondsPast / 60)} minutes ago`;
  } else if (secondsPast < 60 * 60 * 24) {
    return `${Math.round(secondsPast / (60 * 60))} hours ago`;
  } else {
    return `${Math.round(secondsPast / (60 * 60 * 24))} days ago`;
  }
};

// Events
const onSelected = (data: unknown): void => {
  const epoch = data as Round;
  console.log(epoch.round);
};

const onPage = (pageNew: number) => {
  page = pageNew;
};

const onType = (tabIndex: number) => {
  if (tabIndex === 0) {
    types = ["swap", "deposit", "withdraw"];
  } else if (tabIndex === 1) {
    types = ["swap"];
  } else if (tabIndex === 2) {
    types = ["deposit"];
  } else if (tabIndex === 3) {
    types = ["withdraw"];
  } else {
    types = [];
  }
};

// Watches
watch(
  () => transactionsPage,
  (ps) => {
    if (ps.length === 0) {
      page = Math.max(1, Math.ceil(transactions.length / txsPerPage));
    }
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trades {
  padding-top: 0.25rem;

  .title {
    margin-right: 1rem;
  }

  ::v-deep(.pagination) {
    li {
      button {
        height: 2rem;
        width: 2rem;
      }
    }
  }

  ::v-deep(.types) {
    margin: 0 1rem;
    font-size: 0.85rem;

    ul {
      width: auto;
      border-bottom: 0;
    }
  }

  .search {
    margin-right: 2rem;
    font-size: 0.9rem;
    width: auto;
  }

  .sandwiched {
    display: flex;
    justify-content: center;
    color: $yellow;
  }

  .deposit {
    color: $green;
  }

  .withdraw {
    color: $red;
  }

  .swap {
    color: lighten($purple, 10%);
  }

  ::v-deep(.trades-columns-data) {
    display: grid;
    grid-column-gap: 2.5rem;
    grid-template-columns:
      6rem 4rem 6rem 6rem minmax(5rem, 2fr)
      6rem 6rem minmax(13rem, 1fr);

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(6),
    div:nth-child(7) {
      justify-content: end;
    }

    div:nth-child(10) {
      justify-content: center;
    }

    .vote-link {
      text-align: center;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Transactions

swap: Swap
withdraw: Withdraw
deposit: Deposit
</i18n>
