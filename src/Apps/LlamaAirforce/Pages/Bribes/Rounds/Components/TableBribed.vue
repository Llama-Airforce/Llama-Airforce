<template>
  <Card :title="t('title')">
    <DataTable
      class="bribed-table"
      :rows="bribed"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="props: { item: Bribed }">
        <Tooltip>
          <template #item>
            <div class="tooltip-bribed-columns-data">
              <div>
                {{ pool(props.item) }}
              </div>

              <div class="end">
                <AsyncValue
                  :value="dollarPerVlAsset(props.item)"
                  :precision="5"
                  type="dollar"
                />
              </div>

              <div class="end">
                <AsyncValue
                  :value="amountDollars(props.item)"
                  :precision="2"
                  type="dollar"
                />
              </div>
            </div>
          </template>

          <div class="bribes">
            <span>{{ pool(props.item) }}</span>
            <ul>
              <li
                v-for="(bribe, i) in bribes(props.item)"
                :key="i"
              >
                <div>{{ bribe.token }}</div>

                <div class="end">
                  <AsyncValue
                    :value="bribe.amountDollars"
                    :precision="2"
                    type="dollar"
                  />
                </div>

                <div class="end">
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
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import type { Bribe, Bribed, Epoch } from "@LAF/Pages/Bribes/Models";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getBribed } from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import { orderBy } from "lodash";

const { t } = useI18n();

// Props
interface Props {
  epoch?: Epoch;
}

const { epoch } = defineProps<Props>();

// Refs
const { protocol } = storeToRefs(useBribesStore());

const columns = computed(() => [
  { id: "pool" as const, label: t("pool"), sort: true as const },
  {
    id: "vlasset" as const,
    label: `$/${vlAssetSymbol(protocol.value)}`,
    sort: true as const,
    align: "end" as const,
  },
  {
    id: "total" as const,
    label: t("total"),
    sort: true as const,
    align: "end" as const,
  },
]);

const { sorting, onSort } = useSort<typeof columns.value>("total");

const bribed = computed((): Bribed[] => {
  if (!epoch) {
    return [];
  }

  const bribed = getBribed(epoch);

  return orderBy(
    bribed,
    (b: Bribed) => {
      switch (sorting.value.column) {
        case "pool":
          return b.pool;
        case "vlasset":
          return b.dollarPerVlAsset;
        case "total":
          return b.amountDollars.reduce((acc, x) => acc + x, 0);
        default:
          return b.dollarPerVlAsset;
      }
    },
    sorting.value.order
  );
});

// Methods
const pool = (bribed: Bribed): string => bribed.pool;

const amountDollars = (bribed: Bribed): number =>
  bribed.amountDollars.reduce((acc, cur) => acc + cur, 0);

const dollarPerVlAsset = (bribed: Bribed): number => bribed.dollarPerVlAsset;

const bribes = (bribed: Bribed): Bribe[] => {
  return chain(epoch?.bribes)
    .filter((bribe) => bribe.pool === bribed.pool)
    .orderBy((bribe) => bribe.amountDollars, "desc")
    .value();
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.bribed-table {
  --columns-data: 1.5fr 0.6fr 0.6fr;

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

  :deep(.tooltip) {
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
          grid-template-columns: 1.5fr 0.6fr 0.6fr;
          grid-column-gap: 1rem;
          align-items: center;

          div {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    > .popper {
      height: auto;

      > .bribes {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 1rem;

        .end {
          justify-self: end;
        }

        > span {
          font-weight: bold;
        }

        > ul {
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
          list-style-type: none;
          min-width: 15rem;

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
