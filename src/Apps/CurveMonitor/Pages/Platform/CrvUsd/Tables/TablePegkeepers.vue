<template>
  <DataTable
    class="datatable-pegkeepers"
    columns-header="1fr minmax(auto, 25rem)"
    columns-data="pegkeepers-columns-data"
    :loading="loading"
    :rows="rows"
    :columns="['Name', 'Debt', 'TVL', 'Volume', 'Fees']"
  >
    <template #header-title>
      <div>{{ t("title") }}</div>

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
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.tvl"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.volumeUSD"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.profit"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.debt, 0)"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.tvl, 0)"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.volumeUSD, 0)"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.profit, 0)"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, DataTable, InputText } from "@/Framework";
import { notEmpty } from "@/Util";
import { getHost } from "@/Services/Host";
import CurveService, {
  type PoolStats,
  type KeepersDebt,
  type KeepersProfit,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

type Row = PoolStats & KeepersDebt & KeepersProfit;

// Refs
const loading = ref(true);
const rowsRaw = ref<Row[]>([]);
const search = ref("");

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

// Hooks
onMounted(async () => {
  loading.value = true;

  const poolStats = await curveService.getPoolStats();
  const keepersDebt = await curveService.getKeepersDebt();
  const keepersProfit = await curveService.getKeepersProfit();

  rowsRaw.value = poolStats.stats
    .map((pool) => {
      const debt = keepersDebt.keepers.find(
        (keeper) => keeper.pool === pool.address
      );

      const profit = keepersProfit.profit.find(
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
    .sort((a, b) => b.tvl - a.tvl);

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pegkeepers {
  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  ::v-deep(.pegkeepers-columns-data) {
    display: grid;
    grid-template-columns: 1fr 4rem 8rem 8rem 6rem;

    @media only screen and (max-width: 1280px) {
      grid-template-columns: 1fr 4rem 4rem 4rem;

      div:nth-child(5) {
        display: none;
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