<script setup lang="ts">
import { type AccountData } from "@PM/Pages/VePrisma/VePrismaService";

const { t } = useI18n();

const { lockers = [] } = defineProps<{
  lockers: AccountData[];
}>();

const search = ref("");

const columns = [
  { id: "locker", label: "Locker", sort: false } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
  { id: "locked", label: "Locked", sort: true, align: "end" } as const,
  { id: "unlocked", label: "Unlocked", sort: true, align: "end" } as const,
  { id: "frozen", label: "Frozen", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("weight");

const rows = computed(() =>
  lockers
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
      }
    }, sorting.value.order)
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<template>
  <Card
    class="lockers-card"
    :title="t('title')"
  >
    <template #actions>
      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          :search="true"
          :placeholder="t('search-placeholder')"
        >
        </InputText>

        <Pagination
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <Table
      class="lockers-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${item.id}`"
            target="_blank"
            @click.stop
          >
            {{ item.id }}
          </a>
        </div>

        <div
          class="end"
          :class="{ zero: item.weight === 0 }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.weight)"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
          ></AsyncValue>
        </div>

        <div
          class="end"
          :class="{ zero: item.locked === 0 }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.locked)"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
          ></AsyncValue>
        </div>

        <div
          class="end"
          :class="{ zero: item.unlocked === 0 }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.unlocked)"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
          ></AsyncValue>
        </div>

        <div
          class="end"
          :class="{ zero: item.frozen === 0 }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.frozen)"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
          ></AsyncValue>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.lockers-card {
  --header-column-actions: 3fr;
}

.lockers-table {
  --col-width: 11ch;
  --columns-data: 1fr repeat(4, minmax(12ch, 0.33fr));

  .zero {
    opacity: 0.5;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Lockers
search-placeholder: Search for...
</i18n>
