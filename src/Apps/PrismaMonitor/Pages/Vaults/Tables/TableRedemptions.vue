<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import RedemptionDetails from "@PM/Components/RedemptionDetails.vue";
import {
  RedemptionService,
  type Redemption,
  type TroveManagerDetails,
} from "@PM/Services";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const redemptionService = new RedemptionService(storeSettings.flavor);

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();

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

const rows = computed(() =>
  data.value
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
      }
    }, sorting.value.order)
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

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
          search
          :placeholder="t('search-placeholder')"
        />

        <Pagination
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        />
      </div>
    </template>

    <Table
      class="redemptions-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @select="showDetails = $event"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${item.redeemer}`"
            @click.stop
          >
            {{ addressShort(item.redeemer) }}
          </a>
        </div>

        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/tx/${item.transaction}`"
            @click.stop
          >
            {{ addressShort(item.transaction) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(item.actual_debt_amount)"
            :precision="Infinity"
          />
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
    <RedemptionDetails
      v-if="!!showDetails"
      :redemption="showDetails"
      :vault-addr="vault?.address ?? ''"
    />
  </Modal>
</template>

<style scoped>
.redemptions-card {
  --header-column-actions: 2fr;
}

.redemptions-table {
  --columns-data: minmax(12ch, 1fr) minmax(12ch, 1fr)
    repeat(3, minmax(11ch, 0.75fr)) 1rem;
}
</style>

<i18n lang="yaml" locale="en">
title: Redemptions
search-placeholder: Search for...
</i18n>
