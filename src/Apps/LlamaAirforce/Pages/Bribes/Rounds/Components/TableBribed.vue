<script setup lang="ts">
import type { Bribe, Bribed, Epoch } from "@LAF/Pages/Bribes/Models";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getBribed } from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";

const { t } = useI18n();

const { epoch } = defineProps<{
  epoch?: Epoch;
}>();

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

  return bribed.orderBy((b) => {
    switch (sorting.value.column) {
      case "pool":
        return b.pool;
      case "vlasset":
        return b.dollarPerVlAsset;
      case "total":
        return b.amountDollars.reduce((acc, x) => acc + x, 0);
    }
  }, sorting.value.order);
});

// Methods
const pool = (bribed: Bribed): string => bribed.pool;

const amountDollars = (bribed: Bribed): number =>
  bribed.amountDollars.reduce((acc, cur) => acc + cur, 0);

const dollarPerVlAsset = (bribed: Bribed): number => bribed.dollarPerVlAsset;

const bribes = (bribed: Bribed): Bribe[] => {
  return (epoch?.bribes ?? [])
    .filter((bribe) => bribe.pool === bribed.pool)
    .orderBy((bribe) => bribe.amountDollars, "desc");
};
</script>

<template>
  <Card :title="t('title')">
    <Table
      class="bribed-table"
      :rows="bribed"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <Tooltip>
          <template #trigger>
            <div class="bribe">
              <div>
                {{ pool(item) }}
              </div>

              <div class="end">
                <AsyncValue
                  type="dollar"
                  :value="dollarPerVlAsset(item)"
                  :precision="5"
                />
              </div>

              <div class="end">
                <AsyncValue
                  type="dollar"
                  :value="amountDollars(item)"
                  :precision="2"
                />
              </div>
            </div>
          </template>

          <div class="bribes">
            <span>{{ pool(item) }}</span>
            <ul>
              <li
                v-for="bribe in bribes(item)"
                :key="bribe.pool"
              >
                <div>{{ bribe.token }}</div>

                <div class="end">
                  <AsyncValue
                    type="dollar"
                    :value="bribe.amountDollars"
                    :precision="2"
                  />
                </div>

                <div class="end">
                  <AsyncValue
                    type="dollar"
                    :value="bribe.amount"
                    :precision="2"
                    :show-symbol="false"
                  />
                </div>
              </li>
            </ul>
          </div>
        </Tooltip>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.bribed-table {
  --columns-data: 1.5fr 0.6fr 0.6fr;

  .tooltip {
    grid-column: 1 / -1;

    .bribe {
      display: grid;
      grid-template-columns: var(--columns-data);
      grid-column-gap: 1rem;
      align-items: center;

      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .bribes {
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
</style>

<i18n lang="yaml" locale="en">
title: All Pools
pool: Pool
total: Total
</i18n>
