<template>
  <DataTable
    class="datatable-liquidations"
    :loading="loading"
    :rows="rowsPage"
    :columns
    :sorting
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

      <div class="end">
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.liquidated_debt)"
          :precision="Infinity"
        ></AsyncValue>
      </div>

      <div class="end">{{ props.item.troves_affected_count }}</div>

      <div class="end">
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
const liquidationService = new LiquidationService(storeSettings.flavor);

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

const columns = [
  "",
  { id: "liquidator", label: "Liquidator", sort: true } as const,
  { id: "tx", label: "Transaction", sort: true } as const,
  { id: "debt", label: "Debt", sort: true, align: "end" } as const,
  { id: "numtroves", label: "# Troves", sort: true, align: "end" } as const,
  { id: "timestamp", label: "Time", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

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
      switch (sorting.value.column) {
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
    }, sorting.value.order)
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-liquidations {
  --columns-header: 1fr 14rem 2fr;

  --col-width: 11ch;
  --columns-data: 20px minmax(12ch, 1fr) minmax(12ch, 1fr)
    repeat(3, minmax(var(--col-width), 0.75fr)) 1rem;

  .title {
    margin-right: 1rem;
  }

  .search {
    flex-grow: 1;
  }

  .select-vault {
    margin-right: 1rem;
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Liquidations
search-placeholder: Search for...
</i18n>
