<template>
  <DataTable
    class="datatable-troves"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
    :sorting="{
      columns: sortColumns,
      enabled: sortColumnsEnabled,
      default: 'updated',
      defaultDir: 'desc',
    }"
    @sort-column="onSort"
  >
    <template #header-content>
      <div style="display: grid; grid-template-columns: auto 1fr">
        <div class="title">{{ t("title") }}</div>

        <TabView
          class="types"
          @tab="onType($event.index)"
        >
          <TabItem header="Open"></TabItem>
          <TabItem header="Closed"></TabItem>
        </TabView>
      </div>

      <div style="display: flex; gap: 1rem; grid-column: 3">
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
          :href="`https://etherscan.io/address/${props.item.owner}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.owner) }}
        </a>
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.debt)"
          :precision="Infinity"
        ></AsyncValue>
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.collateral_usd)"
          :precision="Infinity"
        ></AsyncValue>
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        <AsyncValue
          :value="props.item.collateral_ratio * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        {{ relativeTime(props.item.created_at) }}
      </div>

      <div class="number">
        {{ relativeTime(props.item.last_update) }}
      </div>
    </template>
    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import { type Vault, icon } from "@PM/Models/Vault";
import {
  type Trove,
  type TroveStatus,
  type TroveManagerDetails,
  TroveService,
} from "@PM/Services";

type Row = Trove & { vault: Vault };

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const troveService = new TroveService(storeSettings.flavor);

// Props
interface Props {
  vaults: TroveManagerDetails[];
  user?: string;
}
const { vaults = [], user } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  troves: [troves: Row[]];
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

const { sortColumns, sortColumn, sortOrder, onSort } = useSort(
  ["", "owner", "debt", "coll", "ratio", "created", "updated"],
  "updated"
);

const columns = computed((): string[] => {
  if (type.value === "Open") {
    return [
      "",
      "Owner",
      "Debt",
      "Collateral",
      "Ratio",
      "Created At",
      "Last Updated",
    ];
  } else {
    return ["", "Owner", "", "", "", "Created At", "Last Updated"];
  }
});

const sortColumnsEnabled = computed((): (typeof sortColumn.value)[] => {
  if (type.value === "Open") {
    return ["owner", "debt", "coll", "ratio", "created", "updated"];
  } else {
    return ["owner", "created", "updated"];
  }
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => type.value === row.status)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.owner);
    })
    .orderBy((row) => {
      switch (sortColumn.value) {
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
        default:
          return row.last_update;
      }
    }, sortOrder.value)
    .value()
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-troves {
  --columns-header: 1fr 14rem 2fr;

  --col-width: 11ch;
  --columns-data: 20px minmax(12ch, 1fr)
    repeat(3, minmax(var(--col-width), 0.75fr)) minmax(12ch, 1fr)
    minmax(12ch, 1fr) 1rem;

  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

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

  .search {
    flex-grow: 1;
  }

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

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6),
    div:nth-child(7) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Troves
search-placeholder: Search for...
</i18n>
