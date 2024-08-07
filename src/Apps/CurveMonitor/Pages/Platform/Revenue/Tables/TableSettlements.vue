<template>
  <Card :title="t('title')">
    <template #actions>
      <div class="header-content">
        <Pagination
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <DataTable
      class="settlements-table"
      :rows="rowsPage"
      :columns
      :sorting
      :expanded
      expand-side="right"
      @sort-column="onSort"
      @selected="toggleExpansion"
    >
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

        <div class="end">
          <AsyncValue
            :value="item.amountReceived"
            :precision="2"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="item.routerReceived"
            :precision="2"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="item.routerReceived > 1"
            :value="profit(item)"
            :precision="2"
            :inline="false"
            type="dollar"
          />
        </div>

        <div class="end profit">
          <AsyncValue
            v-if="item.routerReceived > 1"
            class="pct"
            :value="profitPct(item)"
            :precision="2"
            :inline="false"
            :class="{ green: profitPct(item) > 0 }"
            type="percentage"
          />
        </div>

        <div class="end">
          <a
            class="font-mono"
            :href="`https://explorer.cow.fi/tx/${item.txHash}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.txHash) }}
          </a>
        </div>

        <div class="end">
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
  </Card>
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
const columns = [
  { id: "token", label: "Token", sort: false } as const,
  { id: "amount", label: "Amount", sort: true, align: "end" } as const,
  { id: "quote", label: "Quote", sort: true, align: "end" } as const,
  { id: "profit", label: "Profit", sort: true, align: "end" } as const,
  { id: "profitPct", label: "(%)", sort: true, align: "end" } as const,
  { id: "tx", label: "Transaction", sort: false, align: "end" } as const,
  { id: "timestamp", label: "Time", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  chain(settlements)
    .orderBy((settlement) => {
      switch (sorting.value.column) {
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
    }, sorting.value.order)
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

const { expanded, toggleExpansion } = useExpansion<Row>();
const { relativeTime } = useRelativeTime();

// Formatters
function profit(settlement: CowSwapSettlement) {
  return settlement.amountReceived - settlement.routerReceived;
}

function profitPct(settlement: CowSwapSettlement) {
  return (100 * settlement.amountReceived) / settlement.routerReceived - 100;
}

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

.header-content {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.settlements-table {
  --columns-data: minmax(5rem, 1fr) minmax(10ch, 1fr) minmax(10ch, 1fr)
    minmax(10ch, 1fr) 10ch minmax(5rem, 0.75fr) 16ch 20px;

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

  a {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: CowSwap Settlements
</i18n>
