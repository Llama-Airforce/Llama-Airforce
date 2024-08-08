<template>
  <Card
    class="liquidations-card"
    :title="t('title')"
  >
    <template #actions>
      <SelectVault
        :vault="vault"
        :all="true"
        @select-vault="vault = $event"
      ></SelectVault>

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

    <DataTable
      class="liquidations-table"
      :loading="loading || troves.length === 0"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @selected="showDetails = $event"
    >
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

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import LiquidationDetails from "@PM/Components/LiquidationDetails.vue";
import SelectVault from "@PM/Components/SelectVault.vue";
import { type Liquidation, LiquidationService } from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();

// Services
const liquidationService = new LiquidationService(storeSettings.flavor);

type Row = Liquidation;

const { t } = useI18n();

// Props
interface Props {
  troves: string[];
}
const { troves = [] } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-liquidations-troves", computed(() => troves)] as const,
  queryFn: ({ queryKey: [, troves] }) => {
    return Promise.all(
      chain(troves)
        .uniq()
        .map((trove) =>
          liquidationService.getLiquidationsForTrove("ethereum", trove)
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

.liquidations-card {
  --header-columns: 1fr 14rem 2fr;
}

.liquidations-table {
  --col-width: 11ch;
  --columns-data: 20px minmax(12ch, 1fr) minmax(12ch, 1fr)
    repeat(3, minmax(var(--col-width), 0.75fr)) 1rem;

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
