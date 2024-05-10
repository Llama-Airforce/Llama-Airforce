<template>
  <DataTable
    class="datatable-redemptions"
    columns-header="1fr 2fr"
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
    @selected="onSelect"
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
          :href="`https://etherscan.io/address/${props.item.redeemer}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.redeemer) }}
        </a>
      </div>

      <div>
        <a
          class="font-mono"
          :href="`https://etherscan.io/tx/${props.item.transaction}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.transaction) }}
        </a>
      </div>

      <div class="number">
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.actual_debt_amount)"
          :precision="Infinity"
        ></AsyncValue>
      </div>

      <div class="number">{{ props.item.troves_affected_count }}</div>

      <div class="number">
        {{ relativeTime(props.item.timestamp) }}
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>

  <Modal
    :show="!!showDetails"
    @close="showDetails = null"
  >
    <RedemptionDetails
      v-if="!!showDetails"
      :redemption="showDetails"
      :vault-addr="vault?.address ?? ''"
    ></RedemptionDetails>
  </Modal>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import RedemptionDetails from "@PM/Components/RedemptionDetails.vue";
import {
  RedemptionService,
  type Redemption,
  type TroveManagerDetails,
} from "@PM/Services";

type Row = Redemption;

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const redemptionService = new RedemptionService(
  getHost(),
  storeSettings.flavor
);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-vault-redemptions", vault?.address] as const,
  queryFn: ({ queryKey: [, vault] }) => {
    if (vault) {
      return redemptionService.getRedemptions("ethereum", vault);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Refs
const { relativeTime } = useRelativeTime();

type SortColumns = "redeemer" | "tx" | "debt" | "numtroves" | "timestamp";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("timestamp");

const search = ref("");
const showDetails = ref<Redemption | null>(null);

const columns = computed((): string[] => {
  return ["Redeemer", "Transaction", "Debt", "# Troves", "Time"];
});

const columnsSorting = computed((): string[] => {
  return ["redeemer", "tx", "debt", "numtroves", "timestamp"];
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
          case "tx":
            return row.transaction;
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

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

// Events
const onSelect = (row: unknown) => {
  showDetails.value = row as Redemption;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-redemptions {
  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  .search {
    flex-grow: 1;
  }

  ::v-deep(.redemptions-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      minmax(12ch, 1fr) minmax(12ch, 1fr) repeat(
        3,
        minmax(var(--col-width), 0.75fr)
      )
      1rem;

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;
    }

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Redemptions
search-placeholder: Search for...
</i18n>
