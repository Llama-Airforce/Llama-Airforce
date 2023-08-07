<template>
  <DataTable
    class="datatable-sandwiches"
    columns-header="auto 1fr auto"
    columns-data="sandwiches-columns-data"
    :rows="sandwiches"
    :columns="['Block', 'Pool', 'Action', 'Label', 'Time']"
    :expanded="expanded"
    @selected="onSelected"
  >
    <template #header-title>
      <div class="title">{{ t("title") }}</div>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template
      v-if="numSandwiches > swsPerPage"
      #header-actions
    >
      <Pagination
        class="pagination"
        :items-count="numSandwiches"
        :items-per-page="swsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: SandwichDetail }">
      <div class="number">
        <a
          class="vote-link"
          :href="`https://etherscan.io/block/${props.item.frontrun.block_number}`"
          target="_blank"
        >
          {{ props.item.frontrun.block_number }}
        </a>
      </div>

      <div>{{ props.item.poolName }}</div>

      <div>
        <div
          style="display: grid; gap: 1ch; grid-template-columns: auto 16ch 1fr"
        >
          <a
            class="vote-link"
            style="font-family: monospace"
            target="_blank"
            :href="`https://etherscan.io/address/${props.item.center[0].trader}`"
          >
            {{ addressShort(props.item.center[0].trader) }}
          </a>
          <span>
            lost
            {{
              roundPhil(
                props.item.user_losses_details.reduce(
                  (acc, x) => acc + x.amount,
                  0
                )
              )
            }}
            {{ props.item.user_losses_details[0].unit }}
          </span>
          <span>
            {{
              roundPhil(-props.item.user_losses_details[0].lossInPercentage)
            }}% slippage, or ${{ roundPhil(props.item.lossInUsd) }}
          </span>
        </div>
      </div>

      <div>
        {{ props.item.label }}
      </div>

      <div class="number">
        {{ relativeTime(props.item.frontrun.block_unixtime) }}
      </div>
    </template>

    <template #row-details="props: { item: SandwichDetail }">
      <Transactions
        class="transactions"
        :txs="sandwichTxs(props.item)"
        :header="false"
        :compact="true"
        :time="false"
      ></Transactions>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { chain, orderBy } from "lodash";
import { addressShort } from "@/Wallet";
import { roundPhil } from "@/Util";
import { DataTable, InputText, Pagination } from "@/Framework";
import { MEVService } from "@CM/Pages/Pool/MEV/Services";
import Transactions from "@CM/Pages/Pool/MEV/Components/Transactions.vue";
import { useMEVStore } from "@CM/Pages/Pool/MEV/Store";
import { relativeTime as relativeTimeFunc } from "@CM/Util";
import {
  type TransactionDetail,
  type SandwichDetail,
  type SocketMEV,
} from "@CM/Services/Sockets/SocketMEV";

const { t } = useI18n();

const swsPerPage = 10;

// Refs
const store = useMEVStore();

const search = ref("");
const expanded = ref<SandwichDetail[]>([]);
const now = ref(Date.now());

const page = computed((): number => store.sandwichesPage.cur);
const numSandwiches = computed(
  (): number => store.sandwichesPage.total * swsPerPage
);

const sandwiches = computed((): SandwichDetail[] =>
  chain(store.sandwiches)
    .filter((sw) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return (
        includesTerm(sw.poolName.toString()) ||
        includesTerm(sw.poolAddress.toString()) ||
        includesTerm(sw.label.toString())
      );
    })
    .orderBy(
      [(x) => x.frontrun.block_unixtime, (x) => x.frontrun.tx_position],
      "desc"
    )
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

const toggleExpansion = (sw: SandwichDetail): boolean => {
  if (!expanded.value.includes(sw)) {
    expanded.value.push(sw);
    return true;
  } else {
    expanded.value = expanded.value.filter((x) => x !== sw);
    return false;
  }
};

const sandwichTxs = (sw: SandwichDetail): TransactionDetail[] =>
  orderBy(
    [sw.frontrun, ...sw.center, sw.backrun],
    [(x) => x.block_unixtime, (x) => x.tx_position]
  );

// Events
const onPage = async (pageNew: number) => {
  if (!store.socket) {
    return;
  }

  const mevService = new MEVService(store.socket as SocketMEV);

  const { sandwiches, totalPages } = await mevService.getSandwiches(pageNew);
  store.sandwiches = sandwiches;
  store.sandwichesPage = { cur: pageNew, total: totalPages };
};

const onSelected = (data: unknown): void => {
  const sw = data as SandwichDetail;
  toggleExpansion(sw);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-sandwiches {
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

  .search {
    font-size: 0.875rem;
    width: 600px;
    justify-self: end;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-right: 2rem;

    @media only screen and (max-width: 1280px) {
      width: auto;
    }
  }

  ::v-deep(.sandwiches-columns-data) {
    display: grid;
    grid-column-gap: 2.5rem;
    grid-template-columns: 4rem 16rem 1fr 16rem 8rem 1rem;

    // Right adjust number columns.
    div:nth-child(1),
    div:nth-child(5) {
      justify-content: end;
    }
  }

  ::v-deep(.transactions) {
    .row-data {
      border-bottom-width: 0;
      background-color: var(--container-background-hint);
    }
  }

  ::v-deep(.collapsible-outside) {
    transition: grid-template-rows 200ms ease-out;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Sandwiches
search-placeholder: Search for...
</i18n>
