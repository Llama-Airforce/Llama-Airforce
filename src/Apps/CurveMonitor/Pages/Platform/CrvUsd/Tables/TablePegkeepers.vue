<template>
  <DataTable
    class="datatable-pegkeepers"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="pegkeepers-columns-data"
    :loading="loading"
    :rows="rows"
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
          :value="props.item.debt"
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
          :value="props.item.profit"
          :precision="decimals"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.debt, 0)"
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
          :value="rows.reduce((acc, x) => acc + x.profit, 0)"
          :precision="decimals"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import CurveService, {
  type PoolStats,
  type KeepersDebt,
  type KeepersProfit,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

type Row = PoolStats & KeepersDebt & KeepersProfit;

// Refs
const search = ref("");

const loading = computed(
  () =>
    loadingPoolStats.value ||
    loadingKeepersDebt.value ||
    loadingKeepersProfit.value
);

const rowsRaw = computed(() =>
  chain(poolStats.value)
    .map((pool) => {
      const debt = keepersDebt.value.find(
        (keeper) => keeper.pool === pool.address
      );

      const profit = keepersProfit.value.find(
        (keeper) => keeper.pool === pool.address
      );

      if (!debt || !profit) {
        return undefined;
      }

      return {
        ...pool,
        ...debt,
        ...profit,
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
const { isFetching: loadingPoolStats, data: poolStats } = useQuery({
  queryKey: ["crvusd-pool-stats"],
  queryFn: () => curveService.getPoolStats().then((x) => x.stats),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const { isFetching: loadingKeepersDebt, data: keepersDebt } = useQuery({
  queryKey: ["crvusd-keepers-debt"],
  queryFn: () => curveService.getKeepersDebt().then((x) => x.keepers),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const { isFetching: loadingKeepersProfit, data: keepersProfit } = useQuery({
  queryKey: ["crvusd-keepers-profit"],
  queryFn: () => curveService.getKeepersProfit().then((x) => x.profit),
  initialData: [],
  initialDataUpdatedAt: 0,
});

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
