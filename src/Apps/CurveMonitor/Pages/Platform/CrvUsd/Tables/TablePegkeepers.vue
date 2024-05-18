<template>
  <DataTable
    class="datatable-pegkeepers"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="pegkeepers-columns-data"
    :loading
    :rows
    :columns="['Name', 'Debt', 'TVL', 'Volume', 'Fees']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template #row="props: { item: Row }">
      <div>{{ props.item.name }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.total_debt"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.tvl"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.volumeUSD"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.total_profit"
          :precision="decimals"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.total_debt, 0)"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.tvl, 0)"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.volumeUSD, 0)"
          :precision="decimals"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.total_profit, 0)"
          :precision="decimals"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type PoolStats, type Keeper } from "@CM/Services/CrvUsd";
import {
  useQueryPoolStats,
  useQueryKeepers,
} from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

type Row = PoolStats & Keeper;

// Refs
const search = ref("");

const loading = computed(() => loadingPoolStats.value || loadingKeepers.value);

const rowsRaw = computed(() =>
  chain(poolStats.value)
    .map((pool) => {
      const keeper = keepers.value.find(
        (keeper) => keeper.pool_address === pool.address
      );

      if (!keeper) {
        return undefined;
      }

      return {
        ...pool,
        ...keeper,
      };
    })
    .filter(notEmpty)
    .sortBy((x) => x.tvl)
    .value()
);

const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.name) || includesTerm(row.address);
    })
    .value()
);

// Data
const { isFetching: loadingPoolStats, data: poolStats } = useQueryPoolStats();
const { isFetching: loadingKeepers, data: keepers } = useQueryKeepers();

// Methods
const decimals = (x: number): number => (x >= 1_000_000 ? 2 : 0);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pegkeepers {
  container-type: inline-size;

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  ::v-deep(.pegkeepers-columns-data) {
    --col-width: 12ch;

    display: grid;
    grid-template-columns: 1fr repeat(4, var(--col-width));

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 750px) {
        --col-width: 11ch;
      }

      @container (max-width: 650px) {
        --col-width: 10ch;
      }

      @container (max-width: 600px) {
        --col-width: 9ch;
      }

      @container (max-width: 575px) {
        --col-width: 8ch;
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      @container (max-width: 575px) {
        --col-width: 11ch;
      }

      @container (max-width: 525px) {
        --col-width: 10ch;
      }

      @container (max-width: 500px) {
        --col-width: 9ch;
      }

      @container (max-width: 475px) {
        --col-width: 8ch;
      }

      @container (max-width: 450px) {
        --col-width: 7ch;
      }

      @container (max-width: 425px) {
        --col-width: 6ch;
      }

      @container (max-width: 375px) {
        grid-template-columns: 1fr repeat(3, var(--col-width));

        div:nth-child(5) {
          display: none;
        }
      }

      @container (max-width: 325px) {
        grid-template-columns: 1fr repeat(2, var(--col-width));

        div:nth-child(2) {
          display: none;
        }
      }

      @container (max-width: 250px) {
        grid-template-columns: 1fr;

        div:nth-child(3),
        div:nth-child(4) {
          display: none;
        }
      }
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Pegkeepers

search-placeholder: Search for...
</i18n>
