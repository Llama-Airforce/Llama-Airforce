<template>
  <DataTable
    class="datatable-lockers"
    :rows="rowsPage"
    :columns
    :sorting
    @sort-column="onSort"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          class="search"
          :search="true"
          :placeholder="t('search-placeholder')"
        >
        </InputText>

        <Pagination
          class="pagination"
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <template #row="props: { item: Row }">
      <div>
        <a
          class="font-mono"
          :href="`https://etherscan.io/address/${props.item.id}`"
          target="_blank"
          @click.stop
        >
          {{ props.item.id }}
        </a>
      </div>

      <div
        class="end"
        :class="{ zero: props.item.weight === 0 }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.weight)"
          :precision="2"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </div>

      <div
        class="end"
        :class="{ zero: props.item.locked === 0 }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.locked)"
          :precision="2"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </div>

      <div
        class="end"
        :class="{ zero: props.item.unlocked === 0 }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.unlocked)"
          :precision="2"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </div>

      <div
        class="end"
        :class="{ zero: props.item.frozen === 0 }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.frozen)"
          :precision="2"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type AccountData } from "@PM/Pages/VePrisma/VePrismaService";

type Row = AccountData;

const { t } = useI18n();

// Props
interface Props {
  lockers: AccountData[];
}
const { lockers = [] } = defineProps<Props>();

const search = ref("");

const columns = [
  { id: "locker", label: "Locker", sort: false } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
  { id: "locked", label: "Locked", sort: true, align: "end" } as const,
  { id: "unlocked", label: "Unlocked", sort: true, align: "end" } as const,
  { id: "frozen", label: "Frozen", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("weight");

const rows = computed((): Row[] =>
  chain(lockers)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.id);
    })
    .orderBy((row) => {
      switch (sorting.value.column) {
        case "weight":
          return row.weight;
        case "locked":
          return row.locked;
        case "unlocked":
          return row.unlocked;
        case "frozen":
          return row.frozen;
        default:
          return row.weight;
      }
    }, sorting.value.order)
    .value()
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-lockers {
  --columns-header: 1fr 3fr;

  --col-width: 11ch;
  --columns-data: 1fr repeat(4, minmax(12ch, 0.33fr));

  .title {
    margin-right: 1rem;
  }

  .search {
    flex-grow: 1;
  }

  .zero {
    opacity: 0.5;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Lockers
search-placeholder: Search for...
</i18n>
