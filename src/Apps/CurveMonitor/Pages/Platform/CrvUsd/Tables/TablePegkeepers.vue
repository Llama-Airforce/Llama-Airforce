<template>
  <DataTable
    class="datatable-pegkeepers"
    columns-header="1fr 25rem"
    columns-data="pegkeepers-columns-data"
    :rows="rows"
    :columns="['Name', 'Debt', 'TVL', 'Volume']"
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
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, DataTable, InputText } from "@/Framework";
import { getHost } from "@/Services/Host";
import CurveService, {
  type PoolStats,
  type KeepersDebt,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

type Row = PoolStats & KeepersDebt;

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

  rowsRaw.value = poolStats.stats
    .map((pool) => ({
      ...pool,
      ...keepersDebt.keepers.find((keeper) => keeper.pool === pool.address)!,
    }))
    .sort((a, b) => b.tvl - a.tvl);

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pegkeepers {
  .search {
    font-size: 0.875rem;
  }

  ::v-deep(.pegkeepers-columns-data) {
    display: grid;
    grid-template-columns: 1fr 4rem 8rem 8rem;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Pegkeepers

search-placeholder: Search for...
</i18n>
