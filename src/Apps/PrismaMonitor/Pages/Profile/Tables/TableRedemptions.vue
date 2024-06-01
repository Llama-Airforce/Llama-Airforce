<template>
  <DataTable
    class="datatable-redemptions"
    columns-header="1fr 14rem 2fr"
    columns-data="redemptions-columns-data"
    :loading="loading || troves.length === 0"
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
      :vault-addr="showDetails.vault"
    ></RedemptionDetails>
  </Modal>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import RedemptionDetails from "@PM/Components/RedemptionDetails.vue";
import SelectVault from "@PM/Components/SelectVault.vue";
import { type Redemption, RedemptionService } from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();

// Services
const redemptionService = new RedemptionService(
  getHost(),
  storeSettings.flavor
);

type Row = Redemption;

const { t } = useI18n();

// Props
interface Props {
  troves: string[];
}
const { troves = [] } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-redemptions", computed(() => troves)] as const,
  queryFn: ({ queryKey: [, troves] }) => {
    return Promise.all(
      chain(troves)
        .uniq()
        .map((trove) =>
          redemptionService.getRedemptionsForTrove("ethereum", trove)
        )
        .value()
    ).then((rs) => rs.flat());
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
  ["icon", "redeemer", "tx", "debt", "numtroves", "timestamp"],
  "timestamp"
);

const columns = computed((): string[] => {
  return ["", "Redeemer", "Transaction", "Debt", "# Troves", "Time"];
});

const sortColumnsEnabled = computed((): (typeof sortColumn.value)[] => {
  return ["redeemer", "tx", "debt", "numtroves", "timestamp"];
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      const isVaultFilter =
        vault.value === "all" ? true : row.vault === vault.value;

      return includesTerm(row.redeemer) && isVaultFilter;
    })
    .orderBy((row) => {
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
    }, sortOrder.value)
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-redemptions {
  .title {
    margin-right: 1rem;
  }

  .search {
    flex-grow: 1;
  }

  .select-vault {
    margin-right: 1rem;
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
