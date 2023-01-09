<template>
  <DataTable
    class="datatable-trades"
    columns-header="1fr"
    columns-data="trades-columns-data"
    :rows="rows"
    :columns="['Block', 'Tx', 'Time', 'Trader', 'Pair', 'Amount', 'Fees', '']"
    :expanded="[]"
    :sorting="true"
    :sorting-columns="['', 'Time', 'vlasset', 'total']"
    :sorting-columns-enabled="['deadline', 'vlasset', 'total']"
    sorting-default-column="deadline"
    sorting-default-dir="Descending"
    @sort-column="onSort"
    @selected="onSelected"
  >
    <template #header-title>
      <div>Trades</div>
    </template>

    <template #header-actions>
      <Pagination
        class="pagination"
        :items-count="96"
        :items-per-page="10"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Round }">
      <div class="number">
        <a class="vote-link"> 16363298 </a>
      </div>
      <div @click.stop>
        <a class="vote-link">
          {{
            addressShort(
              "0x59703d575568b3d732da821a54f76e8f6d28ceabe92a6d5c610201a70fe36fc4"
            )
          }}
        </a>
      </div>
      <div>
        {{ new Date(Date.now()).toLocaleDateString() }}
        {{ new Date(Date.now()).toLocaleTimeString() }}
      </div>
      <div @click.stop>
        <a class="vote-link">
          {{
            addressShort(
              "0x59703d575568b3d732da821a54f76e8f6d28ceabe92a6d5c610201a70fe36fc4"
            )
          }}
        </a>
      </div>
      <div>GEAR/ETH</div>
      <div
        class="number"
        :class="{ buy: props.item.value > 0, sell: props.item.value < 0 }"
      >
        <AsyncValue
          :value="Math.abs(props.item.value)"
          :precision="5"
          type="dollar"
        />
      </div>
      <div class="number">
        <AsyncValue
          :value="Math.abs(props.item.value) * 10000"
          :precision="2"
          type="dollar"
        />
      </div>
      <div class="sandwiched">
        <i class="fas fa-hamburger"> </i>
      </div>
    </template>

    <template #row-details="props: { item: never }">
      <div class="details">{{ props.item }}</div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { $ref, $computed } from "vue/macros";
import { orderBy } from "lodash";
import { AsyncValue, DataTable, SortOrder, Pagination } from "@/Framework";
import { addressShort } from "@/Wallet";

let page = $ref(1);

type Round = {
  round: number;
  value: number;
};

let sortColumn: "deadline" | "vlasset" | "total" = $ref("deadline");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const data: Round[] = [
  { round: 1, value: 1 * Math.random() },
  { round: 2, value: 7 * Math.random() },
  { round: 3, value: -5 * Math.random() },
  { round: 4, value: 2 * Math.random() },
  { round: 5, value: 3 * Math.random() },
];

const rows = $computed((): Round[] => {
  return orderBy(
    data ?? [],
    (row: Round) => {
      switch (sortColumn) {
        case "deadline":
          return row.round;
        case "vlasset":
          return row.value;
        case "total":
          return row.value;
        default:
          return row.round;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "deadline" | "vlasset" | "total";
  sortOrder = order;
};

const onSelected = (data: unknown): void => {
  const epoch = data as Round;
  console.log(epoch.round);
};

const onPage = (pageNew: number) => {
  page = pageNew;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trades {
  ::v-deep(.pagination) {
    li {
      button {
        height: 2rem;
        width: 2rem;
      }
    }
  }

  .sandwiched {
    display: flex;
    justify-content: center;
    color: $yellow;
  }

  .buy {
    color: $green;
  }

  .sell {
    color: $red;
  }

  ::v-deep(.trades-columns-data) {
    display: grid;
    grid-column-gap: 2rem;
    grid-template-columns:
      4rem 6rem minmax(15rem, 2fr) 6rem minmax(5rem, 1fr) minmax(5rem, 1fr)
      minmax(5rem, 1fr) 1rem 1rem;

    // Right adjust number columns.
    div:nth-child(1),
    div:nth-child(6),
    div:nth-child(7) {
      justify-content: end;
    }

    div:nth-child(8) {
      justify-content: center;
    }

    .vote-link {
      text-align: center;
    }
  }
}
</style>
