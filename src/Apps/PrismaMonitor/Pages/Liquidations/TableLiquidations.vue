<template>
  <DataTable
    class="datatable-liquidations"
    columns-header="1fr 12rem 2fr"
    columns-data="liquidations-columns-data"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
    :sorting="true"
    :sorting-columns="columnsSorting"
    :sorting-columns-enabled="columnsSortingEnabled"
    sorting-default-column="timestamp"
    sorting-default-dir="Descending"
    @sort-column="onSort"
    @selected="onSelect"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <SelectCollateral
        class="select-collateral"
        :collateral="collateral"
        :all="true"
        @select-collateral="collateral = $event"
      ></SelectCollateral>

      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          class="search"
          style="flex-grow: 1"
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
      <img :src="icon(fromAddress(props.item.vault))" />

      <div>
        <a
          class="font-mono"
          :href="`https://etherscan.io/address/${props.item.liquidator}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.liquidator) }}
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
      :vault-addr="showDetails.vault"
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
import { type Collateral, icon, fromAddress } from "@PM/Models/Collateral";
import LiquidationDetails from "@PM/Components/LiquidationDetails.vue";
import SelectCollateral from "@PM/Components/SelectCollateral.vue";
import {
  getHost,
  type TroveManagerDetails,
  LiquidationService,
  type Liquidation,
} from "@PM/Services";

const liquidationService = new LiquidationService(getHost());

type Row = Liquidation;

const { t } = useI18n();

// Props
interface Props {
  vaults: TroveManagerDetails[];
}
const { vaults = [] } = defineProps<Props>();

// Data
const { loading, data, load } = usePromise(() => {
  if (vaults.length > 0) {
    return Promise.all(
      vaults.map((vault) =>
        liquidationService.getLiquidations("ethereum", vault.address)
      )
    ).then((rs) => rs.flat());
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
const { relativeTime } = useRelativeTime();

type SortColumns = "liquidator" | "tx" | "debt" | "numtroves" | "timestamp";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("timestamp");

const search = ref("");
const collateral = ref<Collateral | "all">("all");
const showDetails = ref<Row | null>(null);

const columns = computed((): string[] => {
  return ["", "Liquidator", "Transaction", "Debt", "# Troves", "Time"];
});

const columnsSorting = computed((): string[] => {
  return ["icon", "liquidator", "tx", "debt", "numtroves", "timestamp"];
});

const columnsSortingEnabled = computed((): string[] => {
  return ["liquidator", "tx", "debt", "numtroves", "timestamp"];
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      const row_collateral = fromAddress(row.vault);
      const isCollateralFilter =
        collateral.value === "all" ? true : collateral.value === row_collateral;

      return includesTerm(row.liquidator) && isCollateralFilter;
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
  showDetails.value = row as Row;
};

// Watches
watch(() => vaults, load);
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

  .select-collateral {
    margin-right: 1rem;
  }

  ::v-deep(.liquidations-columns-data) {
    --col-width: 11ch;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    display: grid;
    grid-template-columns:
      20px minmax(12ch, 1fr) minmax(12ch, 1fr) repeat(
        3,
        minmax(var(--col-width), 0.75fr)
      )
      1rem;

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;
    }

    // Right adjust number columns.
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Liquidations
search-placeholder: Search for...
</i18n>
