<template>
  <DataTable
    class="datatable-settlements"
    columns-header="1fr"
    columns-data="settlements-columns-data"
    :rows="rowsPage"
    :columns="[
      'Token',
      'Amount',
      'Quote',
      'Profit',
      '(%)',
      'Transaction',
      'Time',
    ]"
    :expanded
    expand-side="right"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumnsEnabled"
    sorting-default-column="timestamp"
    sorting-default-dir="desc"
    @sort-column="onSort"
    @selected="toggleExpand"
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

      <div class="number">
        <AsyncValue
          :value="profit(item)"
          :precision="2"
          :inline="false"
          type="dollar"
        />
      </div>

      <div class="number profit">
        <AsyncValue
          class="pct"
          :value="profitPct(item)"
          :precision="2"
          :inline="false"
          :class="{ green: profitPct(item) > 0 }"
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

    <template #row-details="{ item }: { item: Row }">
      <div class="empty"></div>
      <SettlementDetails
        v-if="expanded.includes(item)"
        :settlement="item"
      ></SettlementDetails>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { type CowSwapSettlement } from "@CM/Services/Revenue";
import SettlementDetails from "@CM/Pages/Platform/Revenue/Components/SettlementDetails.vue";

const { t } = useI18n();

type Row = CowSwapSettlement;

// Props
interface Props {
  settlements: CowSwapSettlement[];
}

const { settlements } = defineProps<Props>();

// Data
const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["token", "amount", "quote", "profit", "profitPct", "tx", "timestamp"],
  "timestamp"
);

const sortColumnsEnabled = computed((): (typeof sortColumn.value)[] => {
  return ["amount", "quote", "profit", "profitPct", "timestamp"];
});

const rows = computed(() =>
  chain(settlements)
    .orderBy((settlement) => {
      switch (sortColumn.value) {
        case "amount":
          return settlement.amountReceived;
        case "quote":
          return settlement.routerReceived;
        case "profit":
          return profit(settlement);
        case "profitPct":
          return profitPct(settlement);
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

// Expansion
const expanded = ref<Row[]>([]);
const toggleExpand = (row: Row) => {
  const index = expanded.value.findIndex((r) => r.txHash === row.txHash);
  if (index === -1) {
    expanded.value.push(row);
  } else {
    expanded.value.splice(index, 1);
  }
};

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
      minmax(10ch, 1fr)
      minmax(10ch, 1fr)
      minmax(10ch, 1fr)
      10ch
      minmax(5rem, 0.75fr)
      16ch
      20px;

    .token {
      display: flex;
      gap: 1rem;
      align-items: center;

      img {
        width: 26px;
      }
    }

    .profit {
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
    div:nth-child(6),
    div:nth-child(7) {
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
