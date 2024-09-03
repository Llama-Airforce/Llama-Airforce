<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import {
  type Trove,
  type TroveStatus,
  type TroveManagerDetails,
  TroveService,
} from "@PM/Services";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const troveService = new TroveService(storeSettings.flavor);

const { vaults = [], user } = defineProps<{
  vaults: TroveManagerDetails[];
  user?: string;
}>();

const emit = defineEmits<{
  troves: [troves: (Trove & { vault: Vault })[]];
}>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-troves", toRef(() => vaults), toRef(() => user)] as const,
  queryFn: async ({ queryKey: [, vaults, user] }) => {
    if (vaults.length > 0 && user) {
      // For all vaults, get troves and add vault info to trove.
      const troves = await Promise.all(
        vaults.map((vault) =>
          troveService.getTroves("ethereum", vault.address, user).then((rs) =>
            rs.map((r) => ({
              ...r,
              vault: vault.address,
            }))
          )
        )
      ).then((rs) => rs.flat());

      emit("troves", troves);

      return troves;
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
const type = ref<TroveStatus>("Open");

const columns = computed(() => {
  if (type.value === "Open") {
    return [
      "",
      { id: "owner", label: "Owner", sort: true } as const,
      { id: "debt", label: "Debt", sort: true, align: "end" } as const,
      { id: "coll", label: "Collateral", sort: true, align: "end" } as const,
      { id: "ratio", label: "Ratio", sort: true, align: "end" } as const,
      { id: "created", label: "Created At", sort: true, align: "end" } as const,
      {
        id: "updated",
        label: "Last Updated",
        sort: true,
        align: "end",
      } as const,
    ];
  } else {
    return [
      "",
      { id: "owner", label: "Owner", sort: true } as const,
      "",
      "",
      "",
      { id: "created", label: "Created At", sort: true, align: "end" } as const,
      {
        id: "updated",
        label: "Last Updated",
        sort: true,
        align: "end",
      } as const,
    ];
  }
});

const { sorting, onSort } = useSort<typeof columns.value>("updated");

const rows = computed(() =>
  data.value
    .filter((row) => type.value === row.status)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.owner);
    })
    .orderBy((row) => {
      switch (sorting.value.column) {
        case "owner":
          return row.owner;
        case "debt":
          return row.debt;
        case "coll":
          return row.collateral_usd;
        case "ratio":
          return row.collateral_ratio;
        case "created":
          return row.created_at;
        case "updated":
          return row.last_update;
      }
    }, sorting.value.order)
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

// Events
const onType = (tabIndex: number) => {
  if (tabIndex === 0) {
    type.value = "Open";
  } else if (tabIndex === 1) {
    type.value = "Closed";
  } else {
    type.value = "Open";
  }
};
</script>

<template>
  <Card
    class="troves-card"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <div
        style="
          display: grid;
          gap: 1rem;
          grid-template-columns: minmax(14rem, 1fr) 1fr auto;
        "
      >
        <TabView
          class="types"
          @tab="onType($event.index)"
        >
          <TabItem header="Open"></TabItem>
          <TabItem header="Closed"></TabItem>
        </TabView>

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

    <Table
      class="troves-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <img :src="icon(item.vault)" />

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${item.owner}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.owner) }}
          </a>
        </div>

        <div
          class="end"
          :class="{ hide: type === 'Closed' }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.debt)"
            :precision="Infinity"
          ></AsyncValue>
        </div>

        <div
          class="end"
          :class="{ hide: type === 'Closed' }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.collateral_usd)"
            :precision="Infinity"
          ></AsyncValue>
        </div>

        <div
          class="end"
          :class="{ hide: type === 'Closed' }"
        >
          <AsyncValue
            :value="item.collateral_ratio * 100"
            :precision="2"
            type="percentage"
          />
        </div>

        <div class="end">
          {{ relativeTime(item.created_at) }}
        </div>

        <div class="end">
          {{ relativeTime(item.last_update) }}
        </div>
      </template>

      <!-- Empty for expander arrow and pointer on hover -->
      <template #row-details> &nbsp; </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.troves-card {
  --header-columns: auto 1fr;

  :deep(.types) {
    margin: 0 1rem;
    font-size: 0.875rem;

    ul {
      width: auto;
      border-bottom: 0;
    }

    .tab-header {
      padding: 0.5rem 1rem;
    }
  }
}

.troves-table {
  --col-width: 11ch;
  --columns-data: 20px minmax(12ch, 1fr)
    repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr)
    minmax(12ch, 1fr) 1rem;

  container-type: inline-size;

  img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  :deep(.row-data) {
    .hide {
      visibility: hidden;
    }

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 1100px) {
        --columns-data: 20px minmax(12ch, 0.5fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr)
          minmax(12ch, 1fr) 1rem;
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 1000px) {
        --columns-data: 20px minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr)
          minmax(12ch, 1fr) 1rem;
      }

      @container (max-width: 900px) {
        --columns-data: 20px minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr) 1rem;

        div:nth-child(7) {
          display: none;
        }
      }

      @container (max-width: 600px) {
        --columns-data: 20px minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) 1rem;

        div:nth-child(6) {
          display: none;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Troves
search-placeholder: Search for...
</i18n>
