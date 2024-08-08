<template>
  <Card
    class="card-transfers"
    :title="t('title')"
  >
    <template #actions>
      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          :search="true"
          :placeholder="t('search-placeholder')"
        >
        </InputText>

        <Pagination
          v-if="transfers.length > rowsPerPage"
          :items-count="transfers.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <DataTable
      class="transfers-table"
      :rows="rowsPage"
      :columns="[
        'Hash',
        'Block',
        'Gas',
        'From',
        'To',
        'Amount',
        'Token',
        { label: 'Age', align: 'end' },
      ]"
      :loading
    >
      <template #row="{ item }: { item: CleanedTransfer }">
        <div class="hash">
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${item.txHash}`"
            target="_blank"
          >
            {{ addressLeft(item.txHash, 10) }}
          </a>

          <Button
            icon="fas fa-link"
            @click="clipboard(item.txHash)"
          ></Button>
        </div>

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/block/${item.blockNumber}`"
            target="_blank"
          >
            {{ item.blockNumber }}
          </a>
        </div>

        <div>
          {{ item.gasInGwei }}
        </div>

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${item.transferFrom}`"
            target="_blank"
          >
            {{ addressShort(item.transferFrom, 10) }}
          </a>
        </div>

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/addr ess/${item.transferTo}`"
            target="_blank"
          >
            {{ addressShort(item.transferTo, 10) }}
          </a>
        </div>

        <div>{{ round(item.parsedAmount) }}</div>

        <div class="token">
          <TokenIcon
            chain="ethereum"
            :address="item.coinAddress"
          ></TokenIcon>

          <a
            target="_blank"
            :href="`https://etherscan.io/address/${item.coinAddress}`"
          >
            {{ item.coinSymbol }}
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
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort, addressLeft } from "@/Wallet";
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

      // Min amount parsing.
      const parsedAmount = terms.length === 1 ? parseFloat(terms[0]) : NaN;
      const minAmount = !isNaN(parsedAmount) ? parsedAmount : 0;

      return (
        includesTerm(row.transferFrom) ||
        includesTerm(row.transferTo) ||
        (minAmount > 0 && row.parsedAmount >= minAmount)
      );
    })
    .orderBy([(x) => x.blockUnixtime, (x) => x.positionInBlock], "desc")
    .value()
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(transfers, rowsPerPage);

const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);

const clipboard = async (addr: string) => {
  await navigator.clipboard.writeText(addr);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.transfers-table {
  --columns-header: 1fr 2fr;
  --columns-data: minmax(6rem, 1fr) minmax(5rem, 1fr) 5rem minmax(5rem, 1fr)
    minmax(5rem, 1fr) minmax(5rem, 1fr) calc(26px + 8rem) minmax(5rem, 1fr);

  :deep(.row-data) {
    grid-column-gap: 2rem;
  }

  button {
    background: transparent;

    &:hover,
    &:active {
      background: transparent;
    }
  }

  .hash {
    display: flex;
    align-items: center;
    gap: 1ch;
  }

  .token {
    display: flex;
    align-items: center;
    gap: 1ch;

    img {
      height: 26px;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Transfers
search-placeholder: Search for...
</i18n>
