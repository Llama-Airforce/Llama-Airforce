<template>
  <DataTable
    class="datatable-redemptions"
    columns-header="1fr 12rem minmax(auto, 25rem) auto"
    columns-data="redemptions-columns-data"
    :loading="loading || troves.length === 0"
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
    <template #header-title>
      <div>{{ t("title") }}</div>

      <SelectCollateral
        class="select-collateral"
        :collateral="collateral"
        :all="true"
        @select-collateral="collateral = $event"
      ></SelectCollateral>

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
      <img :src="icon(fromAddress(props.item.vault))" />

      <div>
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/address/${props.item.redeemer}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.redeemer) }}
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

      <div class="number">${{ Math.round(props.item.actual_debt_amount) }}</div>
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
      :vault-addr="showDetails.vault"
    ></RedemptionDetails>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  DataTable,
  InputText,
  Pagination,
  SortOrder,
  Modal,
  useData,
  useRelativeTime,
  useSort,
  usePagination,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import { getHost } from "@/Services/Host";
import { type Collateral, icon, fromAddress } from "@PM/Models/Collateral";
import RedemptionDetails from "@PM/Components/RedemptionDetails.vue";
import SelectCollateral from "@PM/Components/SelectCollateral.vue";
import RedemptionService, {
  type Redemption,
} from "@PM/Services/RedemptionService";

const redemptionService = new RedemptionService(getHost());

type Row = Redemption;

const { t } = useI18n();

// Props
interface Props {
  troves: string[];
}
const { troves = [] } = defineProps<Props>();

// Data
const { loading, data, loadData } = useData(() => {
  return Promise.all(
    troves.map((trove) =>
      redemptionService.getRedemptionsForTrove("ethereum", trove)
    )
  ).then((rs) => rs.flat());
}, []);

// Refs
const { relativeTime } = useRelativeTime();

type SortColumns = "redeemer" | "tx" | "debt" | "numtroves" | "timestamp";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("timestamp");

const search = ref("");
const collateral = ref<Collateral | "all">("all");
const showDetails = ref<Row | null>(null);

const columns = computed((): string[] => {
  return ["", "Redeemer", "Transaction", "Debt", "# Troves", "Time"];
});

const columnsSorting = computed((): string[] => {
  return ["icon", "redeemer", "tx", "debt", "numtroves", "timestamp"];
});

const columnsSortingEnabled = computed((): string[] => {
  return ["redeemer", "tx", "debt", "numtroves", "timestamp"];
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

      return includesTerm(row.redeemer) && isCollateralFilter;
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
  showDetails.value = row as Row;
};

// Watches
watch(() => troves, loadData);
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

  .select-collateral {
    margin-right: 2rem;
  }

  ::v-deep(.redemptions-columns-data) {
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
title: Redemptions
search-placeholder: Search for...
</i18n>
