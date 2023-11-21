<template>
  <DataTable
    class="datatable-liquidations"
    columns-header="1fr 2fr"
    columns-data="liquidations-columns-data"
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
          style="font-family: monospace"
          :href="`https://etherscan.io/address/${props.item.liquidator}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.liquidator) }}
        </a>
      </div>

      <div>
        <a
          style="font-family: monospace"
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
          :value="Math.round(props.item.liquidated_debt)"
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
    <LiquidationDetails
      v-if="!!showDetails"
      :liquidation="showDetails"
      :vault-addr="vault?.address ?? ''"
    ></LiquidationDetails>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  AsyncValue,
  DataTable,
  InputText,
  Pagination,
  SortOrder,
  Modal,
  usePromise,
  useRelativeTime,
  useSort,
  usePagination,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import LiquidationDetails from "@PM/Components/LiquidationDetails.vue";
import {
  getHost,
  LiquidationService,
  type Liquidation,
  type TroveManagerDetails,
} from "@PM/Services";

type Row = Liquidation;

const { t } = useI18n();

const liquidationService = new LiquidationService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { loading, data, load } = usePromise(() => {
  if (vault) {
    return liquidationService.getLiquidations("ethereum", vault.address);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
const { relativeTime } = useRelativeTime();

type SortColumns = "liquidator" | "tx" | "debt" | "numtroves" | "timestamp";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("timestamp");

const search = ref("");
const showDetails = ref<Liquidation | null>(null);

const columns = computed((): string[] => {
  return ["Liquidator", "Transaction", "Debt", "# Troves", "Time"];
});

const columnsSorting = computed((): string[] => {
  return ["liquidator", "tx", "debt", "numtroves", "timestamp"];
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.liquidator);
    })
    .orderBy(
      (row) => {
        switch (sortColumn.value) {
          case "liquidator":
            return row.liquidator;
          case "tx":
            return row.transaction;
          case "debt":
            return row.liquidated_collateral_usd;
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
  showDetails.value = row as Liquidation;
};

// Watches
watch(() => vault, load);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-liquidations {
  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  .search {
    flex-grow: 1;
  }

  ::v-deep(.liquidations-columns-data) {
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
title: Liquidations
search-placeholder: Search for...
</i18n>
