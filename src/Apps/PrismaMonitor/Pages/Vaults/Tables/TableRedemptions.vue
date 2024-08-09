<template>
  <Card
    class="redemptions-card"
    :title="t('title')"
    :loading
  >
    <template #actions>
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
const redemptionService = new RedemptionService(storeSettings.flavor);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-vault-redemptions",
    computed(() => vault?.address),
  ] as const,
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

const search = ref("");
const showDetails = ref<Redemption | null>(null);

const columns = [
  { id: "redeemer", label: "Redeemer", sort: true } as const,
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

      return includesTerm(row.redeemer);
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
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions-card {
  --header-columns: 1fr 2fr;
}

.redemptions-table {
  --col-width: 11ch;
  --columns-data: minmax(12ch, 1fr) minmax(12ch, 1fr)
    repeat(3, minmax(var(--col-width), 0.75fr)) 1rem;
}
</style>

<i18n lang="yaml" locale="en">
title: Redemptions
search-placeholder: Search for...
</i18n>
