<template>
  <DataTable
    class="datatable-cushions"
    columns-header="1fr 25rem"
    columns-data="cushions-columns-data"
    :rows="rows"
    :columns="['Name', 'Coins', 'Fees ($)']"
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
      <div>{{ props.item.pool }}</div>
      <div>{{ props.item.coinNames.join(" / ") }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalUSD"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.totalUSD, 0)"
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
  type Cushion,
} from "@CM/Pages/Platform/Fees/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

type Row = Cushion;

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

      return (
        includesTerm(row.pool) ||
        includesTerm(row.address) ||
        includesTerm(row.coins.join(" "))
      );
    })
    .value()
);

// Hooks
onMounted(async () => {
  loading.value = true;

  rowsRaw.value = await curveService
    .getCushions()
    .then((x) => x.cushions.sort((a, b) => b.totalUSD - a.totalUSD));

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-cushions {
  .search {
    font-size: 0.875rem;
  }

  ::v-deep(.cushions-columns-data) {
    display: grid;
    grid-template-columns: 1fr 1fr 10rem;

    // Right adjust number columns.
    div:nth-child(3) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Cushions

search-placeholder: Search for...
</i18n>
