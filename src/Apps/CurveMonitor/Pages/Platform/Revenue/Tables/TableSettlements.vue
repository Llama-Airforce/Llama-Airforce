<template>
  <DataTable
    class="datatable-settlements"
    columns-header="1fr"
    columns-data="settlements-columns-data"
    :rows="rowsPage"
    :columns="[
      'Token',
      'Amount',
      'Router Amount',
      'Router Profit',
      'Transaction',
      'Time',
    ]"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumnsEnabled"
    sorting-default-column="timestamp"
    sorting-default-dir="desc"
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="header-content">
        <div class="title">{{ t("title") }}</div>

        <Pagination
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <template #row="{ item }: { item: Row }">
      <div class="token">
        <TokenIcon :address="item.coin.address"></TokenIcon>

        <a
          class="font-mono"
          target="_blank"
          :href="`https://etherscan.io/address/${item.coin.address}`"
        >
          {{ symbol(item) }}
        </a>
      </div>

      <div class="number">
        <AsyncValue
          :value="item.amountReceived"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="item.routerReceived"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number profit">
        <AsyncValue
          :value="profit(item)"
          :precision="2"
          :inline="false"
          type="dollar"
        />

        <AsyncValue
          class="pct"
          :value="profitPct(item)"
          :precision="2"
          :inline="false"
          :class="{ green: profit(item) > 0 }"
          type="percentage"
        />
      </div>

      <div class="number">
        <a
          class="font-mono"
          :href="`https://etherscan.io/tx/${item.txHash}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(item.txHash) }}
        </a>
      </div>

      <div class="number">
        {{ relativeTime(item.timestamp) }}
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { type CowSwapSettlement } from "@CM/Services/Revenue";

const { t } = useI18n();

type Row = CowSwapSettlement;

// Props
interface Props {
  settlements: CowSwapSettlement[];
}

const { settlements } = defineProps<Props>();

// Data
const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["token", "amount", "amountRouter", "profit", "tx", "timestamp"],
  "timestamp"
);

const sortColumnsEnabled = computed((): (typeof sortColumn.value)[] => {
  return ["amount", "amountRouter", "profit", "timestamp"];
});

const rows = computed(() =>
  chain(settlements)
    .orderBy((settlement) => {
      switch (sortColumn.value) {
        case "amount":
          return settlement.amountReceived;
        case "amountRouter":
          return settlement.routerReceived;
        case "profit":
          return profit(settlement);
        case "timestamp":
        default:
          return settlement.timestamp;
      }
    }, sortOrder.value)
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

function profit(settlement: CowSwapSettlement) {
  return settlement.amountReceived - settlement.routerReceived;
}

function profitPct(settlement: CowSwapSettlement) {
  return (100 * settlement.amountReceived) / settlement.routerReceived - 100;
}

// Formatters
const { relativeTime } = useRelativeTime();

function symbol(settlement: CowSwapSettlement) {
  const symbol = settlement.coin.symbol;
  if (symbol.includes(":")) {
    return symbol.split(":")[1];
  }

  return symbol;
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-settlements {
  .header-content {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  ::v-deep(.settlements-columns-data) {
    display: grid;
    grid-template-columns:
      minmax(5rem, 1fr)
      minmax(5rem, 1fr)
      minmax(5rem, 1fr)
      minmax(5rem, 1fr)
      minmax(5rem, 0.75fr)
      16ch;

    .token {
      display: flex;
      gap: 1rem;
      align-items: center;

      img {
        width: 26px;
      }
    }

    .profit {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr minmax(4rem, auto);
      gap: 1rem;
      justify-items: end;

      > .pct {
        color: var(--c-red);

        &.green {
          color: var(--c-green);
        }
      }
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6) {
      justify-content: end;
    }

    a {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: CowSwap Settlements
</i18n>
