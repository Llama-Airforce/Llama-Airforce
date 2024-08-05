<template>
  <DataTable
    class="datatable-transfers"
    :rows="rowsPage"
    :columns="[
      '',
      'Token',
      'Amount',
      'From',
      'To',
      { label: 'Time', align: 'end' },
    ]"
    :loading
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
          v-if="transfers.length > rowsPerPage"
          class="pagination"
          :items-count="transfers.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <template #row="{ item }: { item: CleanedTransfer }">
      <TokenIcon
        chain="ethereum"
        :address="item.coinAddress"
      ></TokenIcon>

      <div>
        <a
          class="font-mono"
          target="_blank"
          :href="`https://etherscan.io/address/${item.coinAddress}`"
        >
          {{ item.coinSymbol }}
        </a>
      </div>

      <div>{{ round(item.parsedAmount) }}</div>

      <div>
        <a
          class="font-mono"
          :href="`https://etherscan.io/address/${item.transferFrom}`"
          target="_blank"
        >
          {{ addressShort(item.transferFrom) }}
        </a>
      </div>

      <div>
        <a
          class="font-mono"
          :href="`https://etherscan.io/addr ess/${item.transferTo}`"
          target="_blank"
        >
          {{ addressShort(item.transferTo) }}
        </a>
      </div>

      <div class="end">
        <a
          :href="`https://etherscan.io/tx/${item.txHash}`"
          target="_blank"
          @click.stop
        >
          {{ relativeTime(item.blockUnixtime) }}
        </a>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { type CleanedTransfer } from "@CM/Services/Monitor/Transfers";
import { useQueryTransfers } from "@CM/Services/Monitor/Transfers/Queries";

const { t } = useI18n();

const { data: transfersRaw, isFetching: loading } = useQueryTransfers();
const { relativeTime } = useRelativeTime();

const search = ref("");

const transfers = computed(() =>
  chain(transfersRaw.value ?? [])
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.transferFrom) || includesTerm(row.transferTo);
    })
    .orderBy([(x) => x.blockUnixtime, (x) => x.positionInBlock], "desc")
    .value()
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(transfers, rowsPerPage);

const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-transfers {
  --columns-header: 1fr 2fr;
  --columns-data: 26px 6rem minmax(5rem, 1fr) minmax(5rem, 1fr)
    minmax(5rem, 1fr) minmax(5rem, 1fr);
}
</style>

<i18n lang="yaml" locale="en">
title: Transfers
search-placeholder: Search for...
</i18n>
