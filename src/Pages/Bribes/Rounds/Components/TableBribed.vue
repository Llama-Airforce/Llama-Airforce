<template>
  <DataTable
    class="datatable-bribed"
    columns-header="1fr"
    columns-data="bribed-columns-data"
    :rows="bribed"
    :columns="['', t('pool'), `$/${vlAssetSymbol(protocol)}`, t('total')]"
    :sorting="true"
    :sorting-columns="['', 'pool', 'vlasset', 'total']"
    :sorting-columns-enabled="['pool', 'vlasset', 'total']"
    sorting-default-column="vlasset"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #header-title>
      <div>{{ t("title") }}</div>
    </template>

    <template #row="props: { item: Bribed }">
      <Tooltip>
        <template #item>
          <div class="tooltip-bribed-columns-data">
            <div class="logo">
              <img
                class="logo-img"
                :src="icon(props.item.pool, false)"
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
          </div>
        </template>

        <div class="bribes">
          <ul>
            <li
              v-for="(bribe, i) in bribes(props.item)"
              :key="i"
            >
              <div>{{ bribe.token }}</div>
              <div>
                <AsyncValue
                  :value="bribe.amountDollars"
                  :precision="2"
                  type="dollar"
                />
              </div>
              <div>
                <AsyncValue
                  :value="bribe.amount"
                  :precision="2"
                  :show-symbol="false"
                  type="dollar"
                />
              </div>
            </li>
          </ul>
        </div>
      </Tooltip>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { AsyncValue, DataTable, Tooltip, SortOrder } from "@/Framework";
import { icon } from "@/Util";
import type { Bribe, Bribed, Epoch, Protocol } from "@/Pages/Bribes/Models";
import { useBribesStore } from "@/Pages/Bribes/Store";
import { getBribed } from "@/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@/Pages/Bribes/Util/ProtocolHelper";
import { orderBy } from "lodash";

const { t } = useI18n();

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

const bribes = (bribed: Bribed): Bribe[] => {
  if (!epoch) {
    return [];
  }

  const bribes = epoch.bribes.filter((bribe) => bribe.pool === bribed.pool);

  return orderBy(bribes, (bribe) => bribe.amountDollars, "desc");
};

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "pool" | "vlasset" | "total";
  sortOrder = order;
};
</script>

<style lang="scss" scoped>
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

  ::v-deep(.tooltip) {
    grid-column: 1 / span 4;
    display: flex;
    height: 100%;
    align-items: center;

    > div {
      display: flex;
      flex-grow: 1;
      height: 100%;
      align-items: center;

      > div {
        display: flex;
        flex-grow: 1;
        height: 100%;
        align-items: center;

        > .tooltip-bribed-columns-data {
          flex-grow: 1;
          display: grid;
          grid-template-columns: 20px 1.5fr 1fr 1fr;
          grid-column-gap: 1rem;

          // Right adjust number columns.
          div:nth-child(3),
          div:nth-child(4) {
            justify-self: flex-end;
          }
        }
      }
    }

    > .popper {
      height: auto;

      > .bribes {
        > ul {
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
          list-style-type: none;

          > li {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 1rem;

            > div {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: All Pools
pool: Pool
total: Total
</i18n>
