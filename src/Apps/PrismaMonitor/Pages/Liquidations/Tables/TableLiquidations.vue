<script setup lang="ts">
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

const { t } = useI18n();

const { vaults = [] } = defineProps<{
  vaults: TroveManagerDetails[];
}>();

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
const showDetails = ref<Liquidation | null>(null);

const columns = [
  "",
  { id: "liquidator", label: "Liquidator", sort: true } as const,
  { id: "tx", label: "Transaction", sort: true } as const,
  { id: "debt", label: "Debt", sort: true, align: "end" } as const,
  { id: "numtroves", label: "# Troves", sort: true, align: "end" } as const,
  { id: "timestamp", label: "Time", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  data.value
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
      }
    }, sorting.value.order)
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<template>
  <Card
    class="liquidations-card"
    :title="t('title')"
    :loading
  >
    <template #actions>
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

    <Table
      class="liquidations-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @selected="showDetails = $event"
    >
      <template #row="{ item }">
        <img :src="icon(item.vault)" />

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${item.liquidator}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.liquidator) }}
          </a>
        </div>

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${item.transaction}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.transaction) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(item.liquidated_debt)"
            :precision="Infinity"
          ></AsyncValue>
        </div>

        <div class="end">{{ item.troves_affected_count }}</div>

        <div class="end">
          {{ relativeTime(item.timestamp) }}
        </div>
      </template>

      <!-- Empty for expander arrow and pointer on hover -->
      <template #row-details> &nbsp; </template>
    </Table>
  </Card>

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

<style scoped>
.liquidations-card {
  --header-column-actions: 14rem 2fr;
}

.liquidations-table {
  --columns-data: 20px minmax(12ch, 1fr) minmax(12ch, 1fr)
    repeat(3, minmax(11ch, 0.75fr)) 1rem;

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
