<template>
  <DataTable
    class="datatable-sandwiches"
    :rows="sandwiches"
    :columns="[
      'Pool',
      'Action',
      'Affected Contract',
      { label: 'Time', align: 'end' },
    ]"
    :expanded
    :loading
    @selected="toggleExpansion($event)"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          class="search"
          :search="true"
          :placeholder="t('search-placeholder')"
        >
        </InputText>

        <Pagination
          v-if="numSandwiches > swsPerPage"
          class="pagination"
          :items-count="numSandwiches"
          :items-per-page="swsPerPage"
          :page
          @page="page = $event"
        ></Pagination>
      </div>
    </template>

    <template #row="props: { item: SandwichDetail }">
      <div>
        <a
          class="vote-link"
          :href="`https://etherscan.io/address/${props.item.poolAddress}`"
          target="_blank"
        >
          {{ props.item.poolName }}
        </a>
      </div>

      <div>
        <div
          style="display: grid; gap: 1ch; grid-template-columns: auto 16ch 1fr"
        >
          <a
            class="vote-link font-mono"
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

      <div class="end">
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
import { chain, orderBy } from "lodash";
import { addressShort } from "@/Wallet";
import { roundPhil } from "@/Util";
import Transactions from "@CM/Pages/Platform/MEV/Components/Transactions.vue";
import {
  type TransactionDetail,
  type SandwichDetail,
} from "@CM/Services/Sockets/SocketMEV";
import { useQuerySandwiches } from "@CM/Pages/Platform/MEV/Services/Queries";

const { t } = useI18n();

const swsPerPage = 10;

const page = ref(1);
const { data: sandwichesRaw, isPending: loading } = useQuerySandwiches(page);

const { expanded, toggleExpansion } = useExpansion<SandwichDetail>();
const { relativeTime } = useRelativeTime();

const search = ref("");

const numSandwiches = computed(
  () => sandwichesRaw.value.totalPages * swsPerPage
);

const sandwiches = computed((): SandwichDetail[] =>
  chain(sandwichesRaw.value.sandwiches)
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

const sandwichTxs = (sw: SandwichDetail): TransactionDetail[] =>
  orderBy(
    [sw.frontrun, ...sw.center, sw.backrun],
    [(x) => x.block_unixtime, (x) => x.tx_position]
  );
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-sandwiches {
  --columns-header: 1fr 2fr;
  --columns-data: 16rem 1fr 16rem 8rem 1rem;

  .title {
    margin-right: 1rem;
  }

  :deep(.pagination) {
    li {
      button {
        height: 2rem;
        width: 2rem;
      }
    }
  }

  .search {
    flex-grow: 1;
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

  :deep(.row-data) {
    grid-column-gap: 2.5rem;
  }

  :deep(.transactions) {
    .row-data {
      border-bottom-width: 0;
      background-color: var(--container-background-hint);
    }
  }

  :deep(.collapsible-outside) {
    transition: grid-template-rows 200ms ease-out;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Sandwiches
search-placeholder: Search for...
</i18n>
