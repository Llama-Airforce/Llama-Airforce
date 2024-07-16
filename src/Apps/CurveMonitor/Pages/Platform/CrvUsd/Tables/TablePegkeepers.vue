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
      <div>{{ name(props.item) }}</div>

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
          :value="props.item.tvlUsd"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.tradingVolume24h"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.total_profit"
          :precision="decimals"
          :show-zero="true"
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
          :value="rows.reduce((acc, x) => acc + x.tvlUsd, 0)"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.tradingVolume24h, 0)"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.total_profit, 0)"
          :precision="decimals"
          :show-zero="true"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type Keeper } from "@CM/Services/CrvUsd";
import { type Pool } from "@CM/Services/Pools";
import { useQueryKeepers } from "@CM/Services/CrvUsd/Queries";
import { useQueryPoolMultiple } from "@CM/Services/Pools/Queries";

const { t } = useI18n();

type Row = Pool & Keeper;

// Refs
const search = ref("");

const loading = computed(() => loadingPools.value || loadingKeepers.value);

const rowsRaw = computed(() =>
  chain(keepers.value)
    .map((keeper) => {
      const pool = pools.value.find(
        (pool) => keeper.pool_address === pool.address
      );

      if (!pool) {
        return undefined;
      }

      return {
        ...pool,
        ...keeper,
      };
    })
    .filter(notEmpty)
    .orderBy((x) => x.tvlUsd, "desc")
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

// Keepers
const { isFetching: loadingKeepers, data: keepers } = useQueryKeepers();
const name = (keeper: Keeper): string =>
  `${keeper.pair[1].symbol} / ${keeper.pair[0].symbol}`;

// Pools
const poolAddresses = computed(() =>
  keepers.value.map((keeper) => keeper.pool_address)
);

const poolQueries = useQueryPoolMultiple(ref("ethereum"), poolAddresses);
const loadingPools = computed(() =>
  poolQueries.value.some((x) => x.isFetching)
);
const pools = computed(() =>
  poolQueries.value.filter((x) => x.data).map((x) => x.data!)
);

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

  :deep(.pegkeepers-columns-data) {
    --col-width: 12ch;

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
