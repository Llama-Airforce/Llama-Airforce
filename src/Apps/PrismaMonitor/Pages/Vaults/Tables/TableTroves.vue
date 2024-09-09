<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import {
  TroveService,
  type Trove,
  type TroveStatus,
  type TroveManagerDetails,
} from "@PM/Services";

const { t } = useI18n();

const emit = defineEmits<{
  selected: [trove: Trove];
}>();

// Stores
const storeSettings = useSettingsStore();

// Services
const troveService = new TroveService(storeSettings.flavor);

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-vault-troves", computed(() => vault?.address)] as const,
  queryFn: ({ queryKey: [, vault] }) => {
    if (vault) {
      return troveService.getTroves("ethereum", vault);
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
    :loading
  >
    <template #actions>
      <div
        style="display: grid; gap: 1rem; grid-template-columns: 1fr 2fr auto"
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
      class="troves-table"
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
      @selected="emit('selected', $event)"
    >
      <template #row="{ item }">
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
.troves-card {
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
  --columns-data: minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
    minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;

  container-type: inline-size;

  :deep(.row-data) {
    .hide {
      visibility: hidden;
    }

    /* Non mobile */
    @media only screen and (min-width: 1280px) {
      @container (max-width: 1100px) {
        --columns-data: minmax(12ch, 0.5fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr)
          minmax(12ch, 1fr) 1rem;
      }
    }

    /* Mobile */
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 1000px) {
        --columns-data: minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr)
          minmax(12ch, 1fr) 1rem;
      }

      @container (max-width: 900px) {
        --columns-data: minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr) 1rem;

        div:nth-child(6) {
          display: none;
        }
      }

      @container (max-width: 600px) {
        --columns-data: minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) 1rem;

        div:nth-child(5) {
          display: none;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for...
</i18n>
