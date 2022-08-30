<template>
  <DataTable
    class="datatable-bribed"
    columns-header="1fr"
    columns-data="bribed-columns-data"
    :rows="bribed"
    :columns="['', 'Pool', `$/${vlAssetSymbol(protocol)}`, 'Total']"
    :sorting="true"
    :sorting-columns="['', 'pool', 'vlasset', 'total']"
    :sorting-columns-enabled="['pool', 'vlasset', 'total']"
    sorting-default-column="vlasset"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #header-title>
      <div>All Pools</div>
    </template>

    <template #row="props: { item: Bribed }">
      <div class="logo">
        <img
          class="logo-img"
          :src="icon(props.item.pool, protocol === 'cvx-crv')"
        />
      </div>
      <div>
        {{ pool(props.item) }}
      </div>
      <div class="number">
        <AsyncValue
          :value="dollarPerVlAsset(props.item)"
          :precision="5"
          type="dollar"
        />
      </div>
      <div class="number">
        <AsyncValue
          :value="amountDollars(props.item)"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script
  setup
  lang="ts"
>
import { $ref, $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import DataTable from "@/Framework/DataTable.vue";
import { SortOrder } from "@/Framework/SortOrder";
import type { Bribed } from "@/Pages/Bribes/Models/Bribed";
import type { Epoch } from "@/Pages/Bribes/Models/Epoch";
import type { Protocol } from "@/Pages/Bribes/Models/Protocol";
import { useBribesStore } from "@/Pages/Bribes/Store";
import { getBribed } from "@/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@/Pages/Bribes/Util/ProtocolHelper";
import { icon } from "@/Util/PoolHelper";
import { orderBy } from "lodash";

// Refs
const store = useBribesStore();

let sortColumn: "pool" | "vlasset" | "total" = $ref("vlasset");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const epoch = $computed((): Epoch | null => {
  return store.selectedEpoch;
});

const protocol = $computed((): Protocol | null => {
  return store.selectedProtocol;
});

const bribed = $computed((): Bribed[] => {
  if (!epoch) {
    return [];
  }

  const bribed = getBribed(epoch);

  return orderBy(
    bribed,
    (b: Bribed) => {
      switch (sortColumn) {
        case "pool":
          return b.pool;
        case "vlasset":
          return b.dollarPerVlAsset;
        case "total":
          return b.amountDollars;
        default:
          return b.dollarPerVlAsset;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Methods
const pool = (bribed: Bribed): string => {
  return bribed.pool;
};

const amountDollars = (bribed: Bribed): number => {
  return bribed.amountDollars;
};

const dollarPerVlAsset = (bribed: Bribed): number => {
  return bribed.dollarPerVlAsset;
};

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "pool" | "vlasset" | "total";
  sortOrder = order;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.datatable-bribed {
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  ::v-deep(.bribed-columns-data) {
    display: grid;
    grid-template-columns: 20px 1.5fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }
  }
}
</style>
