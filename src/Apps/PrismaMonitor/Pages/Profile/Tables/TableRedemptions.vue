<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import RedemptionDetails from "@PM/Components/RedemptionDetails.vue";
import SelectVault from "@PM/Components/SelectVault.vue";
import { type Redemption, RedemptionService } from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();

// Services
const redemptionService = new RedemptionService(storeSettings.flavor);

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
      troves
        .uniq()
        .map((trove) =>
          redemptionService.getRedemptionsForTrove("ethereum", trove)
        )
    ).then((rs) => rs.flat());
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Refs
const { relativeTime } = useRelativeTime();

const search = ref("");
const vault = ref<Vault | "all">("all");
const showDetails = ref<Redemption | null>(null);

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
    :loading="loading || troves.length === 0"
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
      <template #row="{ item }">
        <img :src="icon(item.vault)" />

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${item.redeemer}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.redeemer) }}
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
            :value="Math.round(item.actual_debt_amount)"
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
    <RedemptionDetails
      v-if="!!showDetails"
      :redemption="showDetails"
      :vault-addr="showDetails.vault"
    ></RedemptionDetails>
  </Modal>
</template>

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
