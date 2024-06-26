<template>
  <DataTable
    class="datatable-liquidations"
    columns-header="1fr 14rem 2fr"
    columns-data="liquidations-columns-data"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumnsEnabled"
    sorting-default-column="timestamp"
    sorting-default-dir="desc"
    @sort-column="onSort"
    @selected="showDetails = $event"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <SelectVault
        class="select-vault"
        :vault="vault"
        :all="true"
        @select-vault="vault = $event"
      ></SelectVault>

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
      <img :src="icon(props.item.vault)" />

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
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import LiquidationDetails from "@PM/Components/LiquidationDetails.vue";
import SelectVault from "@PM/Components/SelectVault.vue";
import {
  type TroveManagerDetails,
  LiquidationService,
  type Liquidation,
} from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();

// Services
const liquidationService = new LiquidationService(
  useHost(),
  storeSettings.flavor
);

type Row = Liquidation;

const { t } = useI18n();

// Props
interface Props {
  vaults: TroveManagerDetails[];
}
const { vaults = [] } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-liquidations",
    computed(() => vaults.map((vault) => vault.address)),
  ] as const,
  queryFn: ({ queryKey: [, vaults] }) => {
    if (vaults.length > 0) {
      return Promise.all(
        vaults.map((vault) =>
          liquidationService.getLiquidations("ethereum", vault)
        )
      ).then((rs) => rs.flat());
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Refs
const { relativeTime } = useRelativeTime();

const search = ref("");
const vault = ref<Vault | "all">("all");
const showDetails = ref<Row | null>(null);

const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["icon", "liquidator", "tx", "debt", "numtroves", "timestamp"],
  "timestamp"
);

const columns = computed((): string[] => {
  return ["", "Liquidator", "Transaction", "Debt", "# Troves", "Time"];
});

const sortColumnsEnabled = computed((): (typeof sortColumn.value)[] => {
  return ["liquidator", "tx", "debt", "numtroves", "timestamp"];
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      const isVaultFilter =
        vault.value === "all" ? true : row.vault === vault.value;

      return includesTerm(row.liquidator) && isVaultFilter;
    })
    .orderBy((row) => {
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
    }, sortOrder.value)
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
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

  .select-vault {
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
