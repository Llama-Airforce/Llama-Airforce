<template>
  <Card
    class="redemptions-card"
    :title="t('title')"
    :loading
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

    <Table
      class="redemptions-table"
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

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(props.item.actual_debt_amount)"
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
    </Table>
  </Card>

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
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import RedemptionDetails from "@PM/Components/RedemptionDetails.vue";
import SelectVault from "@PM/Components/SelectVault.vue";
import {
  type Redemption,
  type TroveManagerDetails,
  RedemptionService,
} from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();

// Services
const redemptionService = new RedemptionService(storeSettings.flavor);

type Row = Redemption;

const { t } = useI18n();

// Props
interface Props {
  vaults: TroveManagerDetails[];
}
const { vaults = [] } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-redemptions",
    computed(() => vaults.map((vault) => vault.address)),
  ] as const,
  queryFn: ({ queryKey: [, vaults] }) => {
    if (vaults.length > 0) {
      // For all vaults, get redemption and add vault info to redemption.
      return Promise.all(
        vaults.map((vault) =>
          redemptionService.getRedemptions("ethereum", vault)
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
  { id: "redeemer", label: "Redeemer", sort: true } as const,
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

      return includesTerm(row.redeemer) && isVaultFilter;
    })
    .orderBy((row) => {
      switch (sorting.value.column) {
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
    }, sorting.value.order)
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions-card {
  --header-columns: 1fr 14rem 2fr;
}

.redemptions-table {
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
title: Redemptions
search-placeholder: Search for...
</i18n>
