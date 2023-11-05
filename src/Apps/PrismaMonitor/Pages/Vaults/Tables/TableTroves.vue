<template>
  <DataTable
    class="datatable-troves"
    columns-header="1fr 1fr"
    columns-data="troves-columns-data"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
    :sorting="true"
    :sorting-columns="columnsSorting"
    :sorting-columns-enabled="columnsSortingEnabled"
    sorting-default-column="updated"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #header-title>
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
    </template>

    <template #header-actions>
      <Pagination
        class="pagination"
        :items-count="rows.length"
        :items-per-page="rowsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Row }">
      <div @click.stop>
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/address/${props.item.owner}`"
          target="_blank"
        >
          {{ addressShort(props.item.owner) }}
        </a>
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        ${{ Math.round(props.item.debt) }}
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        ${{ Math.round(props.item.collateral_usd) }}
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
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  AsyncValue,
  DataTable,
  InputText,
  Pagination,
  TabView,
  TabItem,
  useData,
  SortOrder,
  useRelativeTime,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import { getHost } from "@/Services/Host";
import TroveService, {
  type Trove,
  type TroveStatus,
} from "@PM/Services/TroveService";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

type Row = Trove;

const { t } = useI18n();

const rowsPerPage = 15;
const troveService = new TroveService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Refs
const { relativeTime } = useRelativeTime();

const search = ref("");
const type = ref<TroveStatus>("Open");
const page = ref(1);

const sortColumn = ref<string>("updated");
const sortOrder = ref(SortOrder.Descending);

const columns = computed((): string[] => {
  if (type.value === "Open") {
    return [
      "Owner",
      "Debt",
      "Collateral",
      "Ratio",
      "Created At",
      "Last Updated",
    ];
  } else {
    return ["Owner", "", "", "", "Created At", "Last Updated"];
  }
});

const columnsSorting = computed((): string[] => {
  if (type.value === "Open") {
    return ["owner", "debt", "coll", "ratio", "created", "updated"];
  } else {
    return ["owner", "", "", "", "created", "updated"];
  }
});

const columnsSortingEnabled = computed((): string[] => {
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
    .orderBy(
      (row) => {
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
      },
      sortOrder.value === SortOrder.Descending ? "desc" : "asc"
    )
    .value()
);

const rowsPage = computed((): Row[] =>
  chain(rows.value)
    .drop((page.value - 1) * rowsPerPage)
    .take(rowsPerPage)
    .value()
);

// Data
const { loading, data, loadData } = useData(() => {
  if (vault) {
    return troveService.getTroves("ethereum", vault.address);
  } else {
    return Promise.resolve([]);
  }
}, []);

// Events
const onPage = (pageNew: number) => {
  page.value = pageNew;
};

const onType = (tabIndex: number) => {
  if (tabIndex === 0) {
    type.value = "Open";
  } else if (tabIndex === 1) {
    type.value = "Closed";
  } else {
    type.value = "Open";
  }
};

const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn.value = columnName;
  sortOrder.value = order;
};

// Watches
watch(() => vault, loadData);

watch(rowsPage, (ps) => {
  if (ps.length === 0) {
    page.value = Math.max(1, Math.ceil(rows.value.length / rowsPerPage));
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-troves {
  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  ::v-deep(.types) {
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
    margin-right: 2rem;
    font-size: 0.875rem;
    width: auto;
  }

  ::v-deep(.troves-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
      minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;

    .hide {
      visibility: hidden;
    }

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 1100px) {
        grid-template-columns:
          minmax(12ch, 0.5fr) repeat(3, minmax(var(--col-width), 0.75fr))
          minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 1000px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
          minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;
      }

      @container (max-width: 900px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
          minmax(12ch, 1fr) 1rem;

        div:nth-child(6) {
          display: none;
        }
      }

      @container (max-width: 600px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
          1rem;

        div:nth-child(5) {
          display: none;
        }
      }
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for...
</i18n>
