<template>
  <DataTable
    class="datatable-redemptions"
    columns-header="1fr 1fr auto"
    columns-data="redemptions-columns-data"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
    :sorting="true"
    :sorting-columns="columnsSorting"
    :sorting-columns-enabled="columnsSorting"
    sorting-default-column="timestamp"
    sorting-default-dir="Descending"
    @sort-column="onSort"
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

    <template #header-actions>
      <Pagination
        class="pagination"
        :items-count="rows.length"
        :items-per-page="rowsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Row }">
      <div @click.stop>
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/address/${props.item.redeemer}`"
          target="_blank"
        >
          {{ addressShort(props.item.redeemer) }}
        </a>
      </div>

      <div class="number">${{ Math.round(props.item.actual_debt_amount) }}</div>
      <div class="number">{{ props.item.troves_affected_count }}</div>

      <div class="number">
        {{ relativeTime(props.item.timestamp) }}
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  DataTable,
  InputText,
  Pagination,
  useData,
  SortOrder,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import { getHost } from "@/Services/Host";
import { relativeTime as relativeTimeFunc } from "@PM/Util";
import PrismaService, { type Redemption } from "@PM/Services/PrismaService";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

type Row = Redemption;

const { t } = useI18n();

const rowsPerPage = 15;
const prismaService = new PrismaService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Refs
const search = ref("");
const page = ref(1);
const now = ref(Date.now());

const sortColumn = ref<string>("timestamp");
const sortOrder = ref(SortOrder.Descending);

const columns = computed((): string[] => {
  return ["Redeemer", "Debt", "# Troves", "Time"];
});

const columnsSorting = computed((): string[] => {
  return ["redeemer", "debt", "numtroves", "timestamp"];
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.redeemer);
    })
    .orderBy(
      (row) => {
        switch (sortColumn.value) {
          case "redeemer":
            return row.redeemer;
          case "debt":
            return row.actual_debt_amount;
          case "numtroves":
            return row.troves_affected_count;
          case "timestamp":
            return row.timestamp;
          default:
            return row.timestamp;
        }
      },
      sortOrder.value === SortOrder.Descending ? "desc" : "asc"
    )
    .value()
);

const rowsPage = computed((): Row[] =>
  chain(rows.value)
    .drop((page.value - 1) * rowsPerPage)
    .take(rowsPerPage)
    .value()
);

// Data
const { loading, data, loadData } = useData(() => {
  if (vault) {
    return prismaService.getRedemptions("ethereum", vault.address);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Hooks
onMounted(() => {
  void loadData();

  setInterval(() => {
    now.value = Date.now();
  });
});

// Methods
const relativeTime = (unixtime: number): string => {
  return relativeTimeFunc(now, unixtime);
};

// Events
const onPage = (pageNew: number) => {
  page.value = pageNew;
};

const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn.value = columnName;
  sortOrder.value = order;
};

// Watches
watch(() => vault, loadData, { immediate: true });

watch(rowsPage, (ps) => {
  if (ps.length === 0) {
    page.value = Math.max(1, Math.ceil(rows.value.length / rowsPerPage));
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-redemptions {
  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  .search {
    margin-right: 2rem;
    font-size: 0.875rem;
    width: auto;
  }

  ::v-deep(.redemptions-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
      1rem;

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;
    }

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
title: Redemptions
search-placeholder: Search for...
</i18n>
